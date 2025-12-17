
import { BirthProfile, BlueprintSnapshot } from '../types';
import { storage, STORAGE_KEYS } from './storage';
import { astrologyEngineMock } from '../features/astrology/engine/astrologyEngineMock';
import { humanDesignEngineMock } from '../features/humanDesign/engine/humanDesignEngineMock';
import { hashStringToSeed } from '../utils/seededRandom';

export const getBlueprintSnapshot = async (
  _userId: string, 
  birthProfile: BirthProfile | null
): Promise<BlueprintSnapshot | null> => {
  if (!birthProfile) return null;

  // 1. Generate ID for current birth data to check validity
  const birthProfileId = `bp_${hashStringToSeed(`${birthProfile.birthDate}${birthProfile.birthTime}${birthProfile.birthCity}`)}`;

  // 2. Try load from cache
  const cached = storage.getJSON<BlueprintSnapshot | null>(STORAGE_KEYS.BLUEPRINT, null);

  // 3. Return cache if valid
  if (cached && cached.birthProfileId === birthProfileId) {
    return cached;
  }

  // 4. Generate new snapshot
  try {
    const [astro, hd] = await Promise.all([
      astrologyEngineMock.getSummary(birthProfile),
      humanDesignEngineMock.getSummary(birthProfile)
    ]);

    const snapshot: BlueprintSnapshot = {
      birthProfileId,
      generatedAtIso: new Date().toISOString(),
      astrology: astro,
      humanDesign: hd
    };

    storage.setJSON(STORAGE_KEYS.BLUEPRINT, snapshot);
    return snapshot;
  } catch (e) {
    console.error("Failed to generate blueprint", e);
    return null;
  }
};

export const invalidateBlueprint = () => {
  storage.remove(STORAGE_KEYS.BLUEPRINT);
};
