
import { BirthProfile, HumanDesignSummary } from '../../../types';

export type HDType = 'Generator' | 'Manifesting Generator' | 'Projector' | 'Manifestor' | 'Reflector';
export type HDAuthority = 'Sacral' | 'Emotional' | 'Splenic' | 'Ego' | 'Self' | 'None';
export type HDProfile = '1/3' | '1/4' | '2/4' | '2/5' | '3/5' | '3/6' | '4/6' | '4/1' | '5/1' | '5/2' | '6/2' | '6/3';

export interface HumanDesignProfile {
  type: HDType;
  authority: HDAuthority;
  profile: HDProfile;
  strategy: string;
  theme: string; // Not-Self Theme
  centers: Record<string, boolean>; // Defined or Undefined
}

export interface HumanDesignEngine {
  calculateProfile: (birthData: BirthProfile) => Promise<HumanDesignProfile>;
  getSummary: (birthData: BirthProfile) => Promise<HumanDesignSummary>;
}
