
import { describe, it, expect, beforeEach } from 'vitest';
import { storage, setStorageDriver } from '../services/storage';
import { MemoryDriver } from '../services/storageDriver/memoryDriver';
import { z } from 'zod';

const TestSchema = z.object({
  id: z.number(),
  name: z.string()
});

describe('Storage Validation', () => {
  let driver: MemoryDriver;

  beforeEach(() => {
    driver = new MemoryDriver();
    setStorageDriver(driver);
  });

  it('returns data if valid', () => {
    driver.setItem('valid', JSON.stringify({ id: 1, name: 'Test' }));
    const result = storage.getValidatedJSON('valid', TestSchema, null);
    expect(result).toEqual({ id: 1, name: 'Test' });
  });

  it('returns fallback if schema mismatch (corrupt data)', () => {
    // Missing 'name'
    driver.setItem('invalid', JSON.stringify({ id: 1 }));
    const result = storage.getValidatedJSON('invalid', TestSchema, { id: 0, name: 'fallback' });
    expect(result).toEqual({ id: 0, name: 'fallback' });
  });

  it('returns fallback if JSON parse fails', () => {
    driver.setItem('bad_json', '{ bad: json }');
    const result = storage.getValidatedJSON('bad_json', TestSchema, { id: 0, name: 'fallback' });
    expect(result).toEqual({ id: 0, name: 'fallback' });
  });
});
