
import { BirthProfile, PlanetKey, AstrologySummary } from '../../../types';

export interface AstroPoint {
  key: PlanetKey | 'rising' | 'mc';
  label: string;
  sign: string;
  degree: number;
  house?: number;
}

export interface AstrologyProfile {
  sunSign: string;
  moonSign: string;
  risingSign: string;
  chartPoints: AstroPoint[];
  summary: string;
}

export interface AstrologyEngine {
  calculateProfile: (birthData: BirthProfile) => Promise<AstrologyProfile>;
  getSummary: (birthData: BirthProfile) => Promise<AstrologySummary>;
}
