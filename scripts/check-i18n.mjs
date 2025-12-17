#!/usr/bin/env node

/**
 * i18n Key Consistency Checker
 * 
 * Validates that all locale files have the same keys and reports:
 * - Missing keys in any locale
 * - Extra keys in any locale
 * - Key count mismatch
 * 
 * Exit code 1 if inconsistencies found, 0 if all OK.
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOCALES_DIR = join(__dirname, '../src/i18n/locales');
const REFERENCE_LOCALE = 'en'; // Use English as reference

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, ...args) {
  console.log(color + args.join(' ') + colors.reset);
}

/**
 * Extract keys from a locale file (simplified parser)
 */
function extractKeys(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const keys = [];
  
  // Match patterns like 'key': 'value',
  const keyRegex = /['"]([^'"]+)['"]\s*:/g;
  let match;
  
  while ((match = keyRegex.exec(content)) !== null) {
    const key = match[1];
    // Skip __meta and other special keys
    if (!key.startsWith('__')) {
      keys.push(key);
    }
  }
  
  return keys.sort();
}

/**
 * Main validation function
 */
function validateLocales() {
  log(colors.cyan, '\n🌍 i18n Key Consistency Checker\n');
  
  // Get all locale files
  const files = readdirSync(LOCALES_DIR)
    .filter(f => f.endsWith('.ts'))
    .map(f => ({
      name: f.replace('.ts', ''),
      path: join(LOCALES_DIR, f)
    }));
  
  log(colors.blue, `Found ${files.length} locale files: ${files.map(f => f.name).join(', ')}`);
  
  // Extract keys from all locales
  const localeKeys = {};
  for (const file of files) {
    localeKeys[file.name] = extractKeys(file.path);
  }
  
  // Use reference locale as baseline
  const referenceKeys = localeKeys[REFERENCE_LOCALE];
  if (!referenceKeys) {
    log(colors.red, `❌ Reference locale '${REFERENCE_LOCALE}' not found!`);
    process.exit(1);
  }
  
  log(colors.blue, `\nReference locale (${REFERENCE_LOCALE}): ${referenceKeys.length} keys`);
  
  // Check each locale against reference
  let hasErrors = false;
  const results = [];
  
  for (const localeName of Object.keys(localeKeys)) {
    if (localeName === REFERENCE_LOCALE) continue;
    
    const keys = localeKeys[localeName];
    const missing = referenceKeys.filter(k => !keys.includes(k));
    const extra = keys.filter(k => !referenceKeys.includes(k));
    
    results.push({
      locale: localeName,
      totalKeys: keys.length,
      missing,
      extra
    });
    
    if (missing.length > 0 || extra.length > 0) {
      hasErrors = true;
    }
  }
  
  // Report results
  console.log('\n' + '='.repeat(60));
  log(colors.cyan, 'VALIDATION RESULTS');
  console.log('='.repeat(60) + '\n');
  
  for (const result of results) {
    const statusIcon = (result.missing.length === 0 && result.extra.length === 0) ? '✅' : '❌';
    const statusColor = (result.missing.length === 0 && result.extra.length === 0) ? colors.green : colors.red;
    
    log(statusColor, `${statusIcon} ${result.locale.toUpperCase()}: ${result.totalKeys} keys`);
    
    if (result.missing.length > 0) {
      log(colors.red, `   ⚠️  Missing ${result.missing.length} keys:`);
      result.missing.forEach(key => {
        console.log(`      - ${key}`);
      });
    }
    
    if (result.extra.length > 0) {
      log(colors.yellow, `   ⚠️  Extra ${result.extra.length} keys:`);
      result.extra.slice(0, 5).forEach(key => {
        console.log(`      - ${key}`);
      });
      if (result.extra.length > 5) {
        console.log(`      ... and ${result.extra.length - 5} more`);
      }
    }
    
    if (result.missing.length === 0 && result.extra.length === 0) {
      log(colors.green, '   ✓ All keys match reference');
    }
    
    console.log('');
  }
  
  console.log('='.repeat(60));
  
  if (hasErrors) {
    log(colors.red, '\n❌ i18n validation FAILED - inconsistencies detected\n');
    process.exit(1);
  } else {
    log(colors.green, '\n✅ i18n validation PASSED - all locales consistent\n');
    process.exit(0);
  }
}

// Run validation
try {
  validateLocales();
} catch (error) {
  log(colors.red, '\n❌ Error running i18n validation:', error.message);
  process.exit(1);
}
