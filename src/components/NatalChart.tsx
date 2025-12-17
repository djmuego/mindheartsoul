
import React from 'react';
import { PlanetKey } from '../types';
import { PLANETS } from '../services/natalChartMock';
import { Brand } from '../constants';

interface NatalChartProps {
  degrees: Record<PlanetKey, number>;
  size?: number;
}

export const NatalChart: React.FC<NatalChartProps> = ({ degrees, size = 320 }) => {
  const center = size / 2;
  const radius = (size / 2) - 10;
  const innerRadius = radius * 0.7;
  
  // Helper to get coordinates
  const getCoords = (deg: number, r: number) => {
    // SVG 0 is 3 o'clock. Astrology 0 (Aries) is usually 9 o'clock.
    // To make 0 be 9 o'clock: deg - 180.
    const rad = ((deg - 180) * Math.PI) / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Background Circle */}
      <circle cx={center} cy={center} r={radius} fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="2" />
      <circle cx={center} cy={center} r={innerRadius} fill="none" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="1" />

      {/* House Lines (12 segments) */}
      {[...Array(12)].map((_, i) => {
        const deg = i * 30;
        const start = getCoords(deg, innerRadius);
        const end = getCoords(deg, radius);
        return (
          <line
            key={i}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeWidth="1"
          />
        );
      })}

      {/* Planets */}
      {PLANETS.map((planet) => {
        const deg = degrees[planet.key];
        const pos = getCoords(deg, (radius + innerRadius) / 2);
        
        return (
          <g key={planet.key}>
            <circle 
              cx={pos.x} 
              cy={pos.y} 
              r={12} 
              className={`fill-white dark:fill-slate-900 stroke-${Brand.colors.primary} dark:stroke-indigo-400`}
              strokeWidth="2"
            />
            <text 
              x={pos.x} 
              y={pos.y} 
              dy="0.3em" 
              textAnchor="middle" 
              className="text-[10px] font-bold fill-slate-900 dark:fill-white select-none pointer-events-none"
            >
              {planet.symbol}
            </text>
          </g>
        );
      })}
      
      {/* Center Decor */}
      <circle cx={center} cy={center} r={4} className={`fill-${Brand.colors.secondary}`} />
    </svg>
  );
};
