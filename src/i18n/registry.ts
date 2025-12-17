
export const FALLBACK_LOCALE = 'en';

export interface LocaleMeta {
  code: string;
  name: string;
  nativeName: string;
}

export interface LocaleDefinition {
  __meta: LocaleMeta;
  [key: string]: string | LocaleMeta;
}

// Vite glob import to find all locale files in ./locales/
const localeModules = (import.meta as any).glob('./locales/*.ts', { eager: true });

export const dictionaries: Record<string, Record<string, string>> = {};
export const availableLocales: LocaleMeta[] = [];

// Parse modules
Object.values(localeModules).forEach((module: any) => {
  const def = module.default as LocaleDefinition;
  if (def && def.__meta) {
    const { code } = def.__meta;
    availableLocales.push(def.__meta);
    
    // Flatten dictionary, excluding __meta from the lookup object
    const dict: Record<string, string> = {};
    Object.keys(def).forEach(key => {
      if (key !== '__meta' && typeof def[key] === 'string') {
        dict[key] = def[key] as string;
      }
    });
    dictionaries[code] = dict;
  }
});

// Sort locales by code for consistency
availableLocales.sort((a, b) => a.code.localeCompare(b.code));
