
import { describe, it, expect, beforeEach } from 'vitest';
import { getBlueprintSnapshot, invalidateBlueprint } from '../services/blueprintService';
import { storage, STORAGE_KEYS } from '../services/storage';
import { BirthProfile } from '../types';

describe('Blueprint Service', () => {
  const mockProfile: BirthProfile = {
    birthDate: '1990-01-01',
    birthTime: '12:00',
    birthCity: 'London',
    tzOffsetMinutes: 0,
    savedAt: new Date().toISOString()
  };

  beforeEach(() => {
    storage.remove(STORAGE_KEYS.BLUEPRINT);
  });

  it('generates blueprint when cache is empty', async () => {
    const snapshot = await getBlueprintSnapshot('u1', mockProfile);
    expect(snapshot).not.toBeNull();
    expect(snapshot?.astrology).toBeDefined();
    expect(snapshot?.humanDesign).toBeDefined();
    expect(snapshot?.astrology?.sunSign).toBeDefined();
  });

  it('returns null if birth profile is missing', async () => {
    const snapshot = await getBlueprintSnapshot('u1', null);
    expect(snapshot).toBeNull();
  });

  it('caches the snapshot', async () => {
    await getBlueprintSnapshot('u1', mockProfile);
    const cached = storage.getJSON(STORAGE_KEYS.BLUEPRINT, null);
    expect(cached).not.toBeNull();
  });

  it('invalidates cache correctly', async () => {
    await getBlueprintSnapshot('u1', mockProfile);
    invalidateBlueprint();
    const cached = storage.getJSON(STORAGE_KEYS.BLUEPRINT, null);
    expect(cached).toBeNull();
  });
});
