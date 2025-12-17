
import { useState, useEffect } from 'react';
import { FeatureFlagKey } from '../types';
import { DEFAULT_FLAGS } from '../config/featureFlags';
import { storage, STORAGE_KEYS } from '../services/storage';

export const useFeatureFlags = () => {
  const [flags, setFlags] = useState<Record<FeatureFlagKey, boolean>>(DEFAULT_FLAGS);

  useEffect(() => {
    // Load overrides from storage
    const stored = storage.getJSON<Record<string, boolean>>(STORAGE_KEYS.FEATURE_FLAGS, {});
    setFlags({ ...DEFAULT_FLAGS, ...stored });
  }, []);

  const setFlag = (key: FeatureFlagKey, value: boolean) => {
    const newFlags = { ...flags, [key]: value };
    setFlags(newFlags);
    
    // Persist only overrides
    const stored = storage.getJSON<Record<string, boolean>>(STORAGE_KEYS.FEATURE_FLAGS, {});
    stored[key] = value;
    storage.setJSON(STORAGE_KEYS.FEATURE_FLAGS, stored);
  };

  const resetFlags = () => {
    setFlags(DEFAULT_FLAGS);
    storage.remove(STORAGE_KEYS.FEATURE_FLAGS);
  };

  return { flags, setFlag, resetFlags };
};
