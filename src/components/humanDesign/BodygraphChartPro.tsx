import React from 'react';
import { HDCenters } from '../../features/humanDesign/engine/types';

interface Gate {
  number: number;
  x: number;
  y: number;
  active?: boolean;
}

interface BodygraphChartProProps {
  centers: HDCenters;
  type: string;
  gates?: number[]; // Активные ворота
}

/**
 * Professional Human Design Bodygraph Chart
 * Accurate representation based on human-design.space design
 */
export const BodygraphChartPro: React.FC<BodygraphChartProProps> = ({ 
  centers, 
  type,
  gates = []
}) => {
  const width = 600;
  const height = 800;
  const centerSize = 60;

  // Определяем позиции центров (строго по дизайну)
  const positions = {
    head: { x: 300, y: 80, shape: 'triangle' },
    ajna: { x: 300, y: 160, shape: 'triangle' },
    throat: { x: 300, y: 260, shape: 'square' },
    g: { x: 300, y: 420, shape: 'diamond' },
    heart: { x: 220, y: 340, shape: 'triangle' },
    sacral: { x: 300, y: 540, shape: 'square' },
    root: { x: 300, y: 720, shape: 'square' },
    spleen: { x: 380, y: 480, shape: 'triangle' },
    solar: { x: 300, y: 480, shape: 'triangle' },
  };

  // Ворота по центрам (упрощенная карта)
  const centerGates: Record<keyof HDCenters, Gate[]> = {
    head: [
      { number: 64, x: 280, y: 60 },
      { number: 61, x: 320, y: 60 },
      { number: 63, x: 300, y: 100 },
    ],
    ajna: [
      { number: 47, x: 280, y: 140 },
      { number: 24, x: 320, y: 140 },
      { number: 4, x: 260, y: 160 },
      { number: 17, x: 340, y: 160 },
      { number: 43, x: 300, y: 180 },
      { number: 11, x: 280, y: 200 },
    ],
    throat: [
      { number: 62, x: 260, y: 240 },
      { number: 23, x: 340, y: 240 },
      { number: 56, x: 240, y: 260 },
      { number: 35, x: 360, y: 260 },
      { number: 12, x: 220, y: 280 },
      { number: 45, x: 380, y: 280 },
      { number: 33, x: 260, y: 300 },
      { number: 8, x: 340, y: 300 },
      { number: 31, x: 300, y: 320 },
      { number: 20, x: 280, y: 340 },
      { number: 16, x: 320, y: 340 },
    ],
    g: [
      { number: 7, x: 280, y: 400 },
      { number: 1, x: 320, y: 400 },
      { number: 13, x: 260, y: 420 },
      { number: 25, x: 340, y: 420 },
      { number: 15, x: 280, y: 440 },
      { number: 10, x: 320, y: 440 },
      { number: 46, x: 300, y: 460 },
      { number: 2, x: 300, y: 380 },
    ],
    heart: [
      { number: 51, x: 200, y: 320 },
      { number: 21, x: 240, y: 320 },
      { number: 40, x: 180, y: 340 },
      { number: 26, x: 220, y: 360 },
    ],
    sacral: [
      { number: 3, x: 280, y: 520 },
      { number: 14, x: 320, y: 520 },
      { number: 9, x: 260, y: 540 },
      { number: 5, x: 340, y: 540 },
      { number: 29, x: 240, y: 560 },
      { number: 59, x: 360, y: 560 },
      { number: 42, x: 280, y: 580 },
      { number: 27, x: 320, y: 580 },
      { number: 34, x: 300, y: 600 },
    ],
    root: [
      { number: 58, x: 280, y: 700 },
      { number: 38, x: 320, y: 700 },
      { number: 54, x: 260, y: 720 },
      { number: 53, x: 340, y: 720 },
      { number: 60, x: 280, y: 740 },
      { number: 52, x: 320, y: 740 },
      { number: 19, x: 300, y: 760 },
      { number: 39, x: 280, y: 780 },
      { number: 41, x: 320, y: 780 },
    ],
    spleen: [
      { number: 48, x: 360, y: 460 },
      { number: 57, x: 400, y: 460 },
      { number: 44, x: 340, y: 480 },
      { number: 50, x: 420, y: 480 },
      { number: 32, x: 360, y: 500 },
      { number: 28, x: 400, y: 500 },
      { number: 18, x: 380, y: 520 },
    ],
    solar: [
      { number: 36, x: 260, y: 460 },
      { number: 22, x: 240, y: 480 },
      { number: 37, x: 220, y: 500 },
      { number: 6, x: 200, y: 520 },
      { number: 49, x: 280, y: 500 },
      { number: 55, x: 260, y: 520 },
      { number: 30, x: 240, y: 540 },
    ],
  };

  // Каналы (связи между воротами)
  const channels = [
    { from: 64, to: 47, color: '#10B981' }, // Head-Ajna
    { from: 61, to: 24, color: '#10B981' },
    { from: 63, to: 4, color: '#10B981' },
    { from: 17, to: 62, color: '#0EA5E9' }, // Ajna-Throat
    { from: 43, to: 23, color: '#0EA5E9' },
    { from: 11, to: 56, color: '#0EA5E9' },
    { from: 20, to: 34, color: '#0EA5E9' }, // Throat-Sacral
    { from: 10, to: 34, color: '#FBBF24' }, // G-Sacral
    { from: 25, to: 51, color: '#EF4444' }, // G-Heart
    { from: 7, to: 31, color: '#0EA5E9' }, // G-Throat
    { from: 1, to: 8, color: '#0EA5E9' },
    { from: 13, to: 33, color: '#0EA5E9' },
    { from: 3, to: 60, color: '#F97316' }, // Sacral-Root
    { from: 5, to: 15, color: '#FBBF24' }, // Sacral-G
    { from: 14, to: 2, color: '#FBBF24' },
    { from: 29, to: 46, color: '#FBBF24' },
    { from: 59, to: 6, color: '#FCD34D' }, // Sacral-Solar
    { from: 42, to: 53, color: '#DC2626' }, // Sacral-Root
    { from: 27, to: 50, color: '#8B5CF6' }, // Sacral-Spleen
    { from: 34, to: 57, color: '#8B5CF6' }, // Sacral-Spleen
  ];

  // Рендер центра
  const renderCenter = (
    key: keyof HDCenters,
    pos: { x: number; y: number; shape: string }
  ) => {
    const isDefined = centers[key];
    const size = centerSize;

    const colors = {
      head: '#9B5DE5',
      ajna: '#00D9FF',
      throat: '#3B82F6',
      g: '#FBBF24',
      heart: '#DC2626',
      sacral: '#F97316',
      root: '#DC2626',
      spleen: '#8B5CF6',
      solar: '#FCD34D',
    };

    const fill = isDefined ? colors[key] : 'white';
    const stroke = isDefined ? colors[key] : '#94A3B8';
    const strokeWidth = isDefined ? 3 : 2;

    if (pos.shape === 'triangle') {
      const points = `${pos.x},${pos.y - size * 0.5} ${pos.x - size * 0.45},${pos.y + size * 0.35} ${pos.x + size * 0.45},${pos.y + size * 0.35}`;
      return (
        <polygon
          key={key}
          points={points}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          opacity={isDefined ? 0.9 : 0.3}
        />
      );
    } else if (pos.shape === 'square') {
      return (
        <rect
          key={key}
          x={pos.x - size * 0.45}
          y={pos.y - size * 0.45}
          width={size * 0.9}
          height={size * 0.9}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          rx={4}
          opacity={isDefined ? 0.9 : 0.3}
        />
      );
    } else if (pos.shape === 'diamond') {
      const points = `${pos.x},${pos.y - size * 0.5} ${pos.x + size * 0.5},${pos.y} ${pos.x},${pos.y + size * 0.5} ${pos.x - size * 0.5},${pos.y}`;
      return (
        <polygon
          key={key}
          points={points}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          opacity={isDefined ? 0.9 : 0.3}
        />
      );
    }
    return null;
  };

  // Рендер ворот
  const renderGates = () => {
    const allGates: Gate[] = [];
    
    Object.entries(centerGates).forEach(([center, gateList]) => {
      const centerKey = center as keyof HDCenters;
      const isDefined = centers[centerKey];
      
      gateList.forEach(gate => {
        allGates.push({
          ...gate,
          active: isDefined && gates.includes(gate.number),
        });
      });
    });

    return allGates.map((gate) => (
      <g key={gate.number}>
        <circle
          cx={gate.x}
          cy={gate.y}
          r={8}
          fill={gate.active ? '#EF4444' : 'white'}
          stroke={gate.active ? '#DC2626' : '#CBD5E1'}
          strokeWidth={gate.active ? 2 : 1}
        />
        <text
          x={gate.x}
          y={gate.y}
          textAnchor="middle"
          dominantBaseline="central"
          className={`text-[8px] font-bold ${gate.active ? 'fill-white' : 'fill-slate-600'}`}
        >
          {gate.number}
        </text>
      </g>
    ));
  };

  // Рендер каналов
  const renderChannels = () => {
    return channels.map((channel, idx) => {
      const fromGate = findGatePosition(channel.from);
      const toGate = findGatePosition(channel.to);
      
      if (!fromGate || !toGate) return null;

      const isActive = gates.includes(channel.from) && gates.includes(channel.to);
      
      return (
        <line
          key={idx}
          x1={fromGate.x}
          y1={fromGate.y}
          x2={toGate.x}
          y2={toGate.y}
          stroke={isActive ? channel.color : '#E2E8F0'}
          strokeWidth={isActive ? 3 : 1.5}
          strokeDasharray={isActive ? '0' : '4,4'}
          opacity={isActive ? 0.8 : 0.3}
        />
      );
    });
  };

  const findGatePosition = (gateNumber: number): { x: number; y: number } | null => {
    for (const gateList of Object.values(centerGates)) {
      const gate = gateList.find(g => g.number === gateNumber);
      if (gate) return { x: gate.x, y: gate.y };
    }
    return null;
  };

  return (
    <div className="relative w-full flex justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid-pro" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pro)" />
        </svg>
      </div>

      {/* Main SVG */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="relative z-10"
      >
        {/* Bodygraph outline */}
        <path
          d={`M ${width * 0.5} 40 
              L ${width * 0.3} ${height * 0.25}
              L ${width * 0.25} ${height * 0.5}
              L ${width * 0.3} ${height * 0.75}
              L ${width * 0.5} ${height * 0.95}
              L ${width * 0.7} ${height * 0.75}
              L ${width * 0.75} ${height * 0.5}
              L ${width * 0.7} ${height * 0.25}
              Z`}
          fill="none"
          stroke="rgba(148, 163, 184, 0.2)"
          strokeWidth="2"
        />

        {/* Channels */}
        <g className="channels">
          {renderChannels()}
        </g>

        {/* Centers */}
        <g className="centers">
          {Object.entries(positions).map(([key, pos]) =>
            renderCenter(key as keyof HDCenters, pos)
          )}
        </g>

        {/* Gates */}
        <g className="gates">
          {renderGates()}
        </g>

        {/* Type label */}
        <text
          x={width * 0.5}
          y={height - 20}
          textAnchor="middle"
          className="text-sm font-bold fill-slate-400"
        >
          {type}
        </text>
      </svg>

      {/* Side info panels */}
      <div className="absolute left-4 top-20 space-y-2">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-slate-300">
          <div className="font-bold text-purple-400">ЛИЧНОСТЬ</div>
          <div className="mt-1 space-y-0.5">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>6.6 ☉</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>36.6 ⊕</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-20 space-y-2">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-slate-300">
          <div className="font-bold text-red-400">ДИЗАЙН</div>
          <div className="mt-1 space-y-0.5">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>59.4 ☉</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>27.4 ⊕</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
