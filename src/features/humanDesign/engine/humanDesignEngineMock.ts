
import { HumanDesignEngine, HumanDesignProfile, HDType } from './types';
import { BirthProfile, HumanDesignSummary } from '../../../types';
import { hashStringToSeed, mulberry32 } from '../../../utils/seededRandom';

export const humanDesignEngineMock: HumanDesignEngine = {
  calculateProfile: async (birthData: BirthProfile): Promise<HumanDesignProfile> => {
    const seedStr = `${birthData.birthDate}${birthData.birthTime}`;
    const seed = hashStringToSeed(seedStr);
    const rand = mulberry32(seed);

    const types: HDType[] = ['Generator', 'Manifesting Generator', 'Projector', 'Manifestor', 'Reflector'];
    const type = types[Math.floor(rand() * types.length)];

    return {
      type,
      authority: 'Emotional',
      profile: '1/3',
      strategy: type === 'Generator' ? 'To Respond' : 'To Wait for Invitation',
      theme: type === 'Generator' ? 'Frustration' : 'Bitterness',
      centers: {
        head: rand() > 0.5,
        ajna: rand() > 0.5,
        throat: rand() > 0.5,
        g: rand() > 0.5,
        heart: rand() > 0.5,
        sacral: true, // Generators have sacral
        root: rand() > 0.5,
        spleen: rand() > 0.5,
        solar: rand() > 0.5,
      }
    };
  },

  getSummary: async (birthData: BirthProfile): Promise<HumanDesignSummary> => {
    // Generate deterministic data based on birth details
    const seedStr = `${birthData.birthDate}${birthData.birthTime}`;
    const seed = hashStringToSeed(seedStr);
    const rand = mulberry32(seed);

    const types: HDType[] = ['Generator', 'Manifesting Generator', 'Projector', 'Manifestor', 'Reflector'];
    const type = types[Math.floor(rand() * types.length)];
    
    return {
      type,
      strategy: type === 'Generator' || type === 'Manifesting Generator' ? 'To Respond' : 'Wait for Invitation',
      authority: 'Emotional',
      profile: '2/4',
      definition: 'Single Definition'
    };
  }
};
