
import { FeatureFlagKey } from '../types';

export const DEFAULT_FLAGS: Record<FeatureFlagKey, boolean> = {
  proEnabled: true,
  aiGuideEnabled: true,
  coursesEnabled: true,
  communityEnabled: true,
  paymentsEnabled: true,
  videoEnabled: true,
  humanDesignEnabled: true, // Visible as placeholder
  astrologyEnabled: true,   // Visible as placeholder
};
