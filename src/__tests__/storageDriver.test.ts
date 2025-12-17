
import { describe, it, expect, beforeEach } from 'vitest';
import { storage, setStorageDriver } from '../services/storage';
import { MemoryDriver } from '../services/storageDriver/memoryDriver';

describe('Storage Driver', () => {
  let driver: MemoryDriver;

  beforeEach(() => {
    driver = new MemoryDriver();
    setStorageDriver(driver);
  });

  it('writes and reads JSON correctly', () => {
    const data = { foo: 'bar' };
    storage.setJSON('test_key', data);
    const result = storage.getJSON('test_key', {});
    expect(result).toEqual(data);
  });

  it('returns fallback if key missing', () => {
    const result = storage.getJSON('missing', 'fallback');
    expect(result).toBe('fallback');
  });

  it('removes item', () => {
    storage.setJSON('test', 'val');
    storage.remove('test');
    const result = storage.getJSON('test', null);
    expect(result).toBeNull();
  });
});
