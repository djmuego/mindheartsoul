
import { AstrologyEngine, AstrologyProfile } from './types';
import { BirthProfile, PlanetKey, AstrologySummary } from '../../../types';
import { computeMockPlanetDegrees, PLANETS } from '../../../services/natalChartMock';

const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const ELEMENTS = ['Fire', 'Earth', 'Air', 'Water'];
const MODALITIES = ['Cardinal', 'Fixed', 'Mutable'];

const getSign = (deg: number) => SIGNS[Math.floor(deg / 30)];

export const astrologyEngineMock: AstrologyEngine = {
  calculateProfile: async (birthData: BirthProfile): Promise<AstrologyProfile> => {
    // Simulate calc delay
    // await new Promise(r => setTimeout(r, 100));
    
    const seed = `${birthData.birthDate}${birthData.birthTime}${birthData.birthCity}`;
    const degrees = computeMockPlanetDegrees(seed);
    
    const points = PLANETS.map(p => ({
      key: p.key,
      label: p.label,
      degree: degrees[p.key],
      sign: getSign(degrees[p.key]),
      house: Math.floor(Math.random() * 12) + 1
    }));

    return {
      sunSign: getSign(degrees['sun']),
      moonSign: getSign(degrees['moon']),
      risingSign: getSign((degrees['sun'] + 90) % 360), // Mock logic
      chartPoints: points as any,
      summary: `Your sun is in ${getSign(degrees['sun'])}, illuminating your core self.`
    };
  },

  getSummary: async (birthData: BirthProfile): Promise<AstrologySummary> => {
    const seed = `${birthData.birthDate}${birthData.birthTime}${birthData.birthCity}`;
    const degrees = computeMockPlanetDegrees(seed);
    const sunSignIndex = Math.floor(degrees['sun'] / 30);

    return {
      sunSign: getSign(degrees['sun']),
      moonSign: getSign(degrees['moon']),
      risingSign: getSign((degrees['sun'] + 90) % 360),
      element: ELEMENTS[sunSignIndex % 4],
      modality: MODALITIES[sunSignIndex % 3],
      planetDegrees: degrees as Record<PlanetKey, number>
    };
  }
};
