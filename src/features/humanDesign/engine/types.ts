
import { BirthProfile, HumanDesignSummary } from '../../../types';

// ========== Basic Types ==========
export type HDType = 'Generator' | 'Manifesting Generator' | 'Projector' | 'Manifestor' | 'Reflector';
export type HDAuthority = 'Sacral' | 'Emotional' | 'Splenic' | 'Ego' | 'Self' | 'None';
export type HDProfile = '1/3' | '1/4' | '2/4' | '2/5' | '3/5' | '3/6' | '4/6' | '4/1' | '5/1' | '5/2' | '6/2' | '6/3';
export type HDDefinition = 'Single' | 'Split' | 'Triple Split' | 'Quadruple Split' | 'None';

// ========== Centers ==========
export type HdCenterId = 'head' | 'ajna' | 'throat' | 'g' | 'heart' | 'sacral' | 'root' | 'spleen' | 'solar';

export interface HDCenters {
  head: boolean;
  ajna: boolean;
  throat: boolean;
  g: boolean;
  heart: boolean;
  sacral: boolean;
  root: boolean;
  spleen: boolean;
  solar: boolean;
}

// ========== Gates & Channels ==========
export type HdGateNumber = number; // 1-64
export type HdChannelId = string; // e.g., '1-8', '10-20'

export interface HdGate {
  number: HdGateNumber;
  line: number; // 1-6
}

export interface HdChannel {
  id: HdChannelId;
  name: string;
  gates: [HdGateNumber, HdGateNumber];
  defined: boolean;
}

// ========== Activations (Design & Personality) ==========
export type HdPlanet = 'Sun' | 'Earth' | 'Moon' | 'North Node' | 'South Node' | 
                       'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn' | 
                       'Uranus' | 'Neptune' | 'Pluto';

export interface HdActivation {
  planet: HdPlanet;
  gate: HdGateNumber;
  line: number; // 1-6
  color?: number; // 1-6 (optional, for advanced)
  tone?: number; // 1-6 (optional, for advanced)
  base?: number; // 1-5 (optional, for advanced)
  kind: 'design' | 'personality';
}

// ========== Full Chart ==========
export interface HumanDesignChart {
  // Core info
  type: HDType;
  authority: HDAuthority;
  profile: HDProfile;
  strategy: string;
  theme: string; // Not-Self Theme
  definition: HDDefinition;
  incarnationCross?: string;

  // Centers (9)
  centers: HDCenters;

  // Activations (Design & Personality)
  designActivations: HdActivation[];
  personalityActivations: HdActivation[];

  // Channels
  definedChannels: HdChannel[];

  // Gates (derived from activations)
  gatesDefined: HdGateNumber[];
}

// ========== Legacy Profile (backward compatibility) ==========
export interface HumanDesignProfile {
  type: HDType;
  authority: HDAuthority;
  profile: HDProfile;
  strategy: string;
  theme: string;
  centers: HDCenters;
}

// ========== Engine Interface ==========
export interface HumanDesignEngine {
  calculateProfile: (birthData: BirthProfile) => Promise<HumanDesignProfile>;
  getSummary: (birthData: BirthProfile) => Promise<HumanDesignSummary>;
  getChart: (birthData: BirthProfile) => Promise<HumanDesignChart>; // NEW: full chart
}
