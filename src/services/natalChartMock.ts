
import { PlanetKey } from '../types';
import { hashStringToSeed, mulberry32 } from '../utils/seededRandom';

export const PLANETS: { key: PlanetKey; label: string; symbol: string }[] = [
  { key: 'sun', label: 'Sun', symbol: 'Su' },
  { key: 'moon', label: 'Moon', symbol: 'Mo' },
  { key: 'mercury', label: 'Mercury', symbol: 'Me' },
  { key: 'venus', label: 'Venus', symbol: 'Ve' },
  { key: 'mars', label: 'Mars', symbol: 'Ma' },
  { key: 'jupiter', label: 'Jupiter', symbol: 'Ju' },
  { key: 'saturn', label: 'Saturn', symbol: 'Sa' },
  { key: 'uranus', label: 'Uranus', symbol: 'Ur' },
  { key: 'neptune', label: 'Neptune', symbol: 'Ne' },
  { key: 'pluto', label: 'Pluto', symbol: 'Pl' },
];

export function computeMockPlanetDegrees(seedInput: string): Record<PlanetKey, number> {
  const seed = hashStringToSeed(seedInput);
  const random = mulberry32(seed);
  
  const degrees: Partial<Record<PlanetKey, number>> = {};
  
  PLANETS.forEach((planet, index) => {
    // Generate a degree between 0 and 360
    // We add index * 30 to distribute them slightly to avoid stacking everything for the MVP visual
    const base = random() * 360;
    degrees[planet.key] = (base + (index * 15)) % 360; 
  });

  return degrees as Record<PlanetKey, number>;
}
