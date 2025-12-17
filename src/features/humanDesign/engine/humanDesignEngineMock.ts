
import { 
  HumanDesignEngine, 
  HumanDesignProfile, 
  HumanDesignChart,
  HDType,
  HdActivation,
  HdChannel,
  HdPlanet,
  HDDefinition
} from './types';
import { BirthProfile, HumanDesignSummary } from '../../../types';
import { hashStringToSeed, mulberry32 } from '../../../utils/seededRandom';

// Helper: Generate deterministic activations
const generateActivations = (
  seed: number, 
  kind: 'design' | 'personality'
): HdActivation[] => {
  const rand = mulberry32(seed + (kind === 'design' ? 1000 : 2000));
  
  const planets: HdPlanet[] = [
    'Sun', 'Earth', 'Moon', 'North Node', 'South Node',
    'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn',
    'Uranus', 'Neptune', 'Pluto'
  ];

  return planets.map(planet => ({
    planet,
    gate: Math.floor(rand() * 64) + 1, // 1-64
    line: Math.floor(rand() * 6) + 1, // 1-6
    color: Math.floor(rand() * 6) + 1,
    tone: Math.floor(rand() * 6) + 1,
    base: Math.floor(rand() * 5) + 1,
    kind,
  }));
};

// Helper: Derive defined channels from activations
const deriveChannels = (
  designActivations: HdActivation[],
  personalityActivations: HdActivation[]
): HdChannel[] => {
  const allActivations = [...designActivations, ...personalityActivations];
  const gatesActive = new Set(allActivations.map(a => a.gate));

  // Simplified channel mapping (real engine would have full 36 channels)
  const channelDefinitions: Array<[number, number, string]> = [
    [64, 47, 'Abstraction'],
    [61, 24, 'Awareness'],
    [63, 4, 'Logic'],
    [17, 62, 'Acceptance'],
    [43, 23, 'Structuring'],
    [11, 56, 'Curiosity'],
    [20, 34, 'Charisma'],
    [10, 57, 'Perfected Form'],
    [25, 51, 'Initiation'],
    [7, 31, 'The Alpha'],
    [1, 8, 'Inspiration'],
    [13, 33, 'Prodigal'],
    [3, 60, 'Mutation'],
    [5, 15, 'Rhythm'],
    [14, 2, 'Beat'],
    [29, 46, 'Discovery'],
    [59, 6, 'Intimacy'],
    [42, 53, 'Maturation'],
    [27, 50, 'Preservation'],
    [34, 57, 'Power'],
  ];

  return channelDefinitions
    .filter(([g1, g2]) => gatesActive.has(g1) && gatesActive.has(g2))
    .map(([g1, g2, name]) => ({
      id: `${g1}-${g2}`,
      name,
      gates: [g1, g2] as [number, number],
      defined: true,
    }));
};

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
        sacral: type === 'Generator' || type === 'Manifesting Generator', // Generators have sacral
        root: rand() > 0.5,
        spleen: rand() > 0.5,
        solar: rand() > 0.5,
      }
    };
  },

  getSummary: async (birthData: BirthProfile): Promise<HumanDesignSummary> => {
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
  },

  // NEW: Full chart generation (deterministic)
  getChart: async (birthData: BirthProfile): Promise<HumanDesignChart> => {
    const seedStr = `${birthData.birthDate}${birthData.birthTime}`;
    const seed = hashStringToSeed(seedStr);
    const rand = mulberry32(seed);

    const types: HDType[] = ['Generator', 'Manifesting Generator', 'Projector', 'Manifestor', 'Reflector'];
    const type = types[Math.floor(rand() * types.length)];

    const definitions: HDDefinition[] = ['Single', 'Split', 'Triple Split', 'Quadruple Split', 'None'];
    const definition = definitions[Math.floor(rand() * definitions.length)];

    // Generate activations
    const designActivations = generateActivations(seed, 'design');
    const personalityActivations = generateActivations(seed, 'personality');

    // Derive channels
    const definedChannels = deriveChannels(designActivations, personalityActivations);

    // Derive gates
    const gatesDefined = Array.from(new Set([
      ...designActivations.map(a => a.gate),
      ...personalityActivations.map(a => a.gate),
    ])).sort((a, b) => a - b);

    // Determine centers (simplified: based on channels)
    const centers = {
      head: rand() > 0.5,
      ajna: rand() > 0.5,
      throat: rand() > 0.5,
      g: rand() > 0.5,
      heart: rand() > 0.5,
      sacral: type === 'Generator' || type === 'Manifesting Generator',
      root: rand() > 0.5,
      spleen: rand() > 0.5,
      solar: rand() > 0.5,
    };

    return {
      type,
      authority: 'Emotional',
      profile: '1/3',
      strategy: type === 'Generator' ? 'To Respond' : 'To Wait for Invitation',
      theme: type === 'Generator' ? 'Frustration' : 'Bitterness',
      definition,
      incarnationCross: 'Left Angle Cross of Tension',
      centers,
      designActivations,
      personalityActivations,
      definedChannels,
      gatesDefined,
    };
  },
};
