import React from 'react';
import { HDCenters } from '../../features/humanDesign/engine/types';

interface BodygraphChartProps {
  centers: HDCenters;
  type: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Human Design Bodygraph Chart - SVG visualization
 * Renders the 9 centers with defined (colored) or undefined (white) states
 */
export const BodygraphChart: React.FC<BodygraphChartProps> = ({ 
  centers, 
  type,
  size = 'large' 
}) => {
  const dimensions = {
    small: { width: 300, height: 400 },
    medium: { width: 400, height: 550 },
    large: { width: 500, height: 700 },
  };

  const { width, height } = dimensions[size];

  // Center colors (when defined)
  const centerColors = {
    head: '#9333EA',      // Purple
    ajna: '#10B981',      // Green
    throat: '#0EA5E9',    // Blue
    g: '#FBBF24',         // Yellow
    heart: '#EF4444',     // Red
    sacral: '#F97316',    // Orange
    root: '#DC2626',      // Dark Red
    spleen: '#8B5CF6',    // Violet
    solar: '#FCD34D',     // Light Yellow
  };

  // Center positions (relative to width/height)
  const centerPositions = {
    head: { x: width * 0.5, y: height * 0.08 },
    ajna: { x: width * 0.5, y: height * 0.18 },
    throat: { x: width * 0.5, y: height * 0.3 },
    g: { x: width * 0.5, y: height * 0.5 },
    heart: { x: width * 0.35, y: height * 0.4 },
    sacral: { x: width * 0.5, y: height * 0.7 },
    root: { x: width * 0.5, y: height * 0.88 },
    spleen: { x: width * 0.65, y: height * 0.6 },
    solar: { x: width * 0.5, y: height * 0.6 },
  };

  // Center shapes (size relative to scale)
  const scale = width / 500;
  const centerShapes = {
    head: { rx: 30 * scale, ry: 25 * scale, shape: 'triangle' },
    ajna: { rx: 30 * scale, ry: 25 * scale, shape: 'triangle' },
    throat: { rx: 32 * scale, ry: 32 * scale, shape: 'square' },
    g: { rx: 35 * scale, ry: 35 * scale, shape: 'diamond' },
    heart: { rx: 28 * scale, ry: 28 * scale, shape: 'triangle' },
    sacral: { rx: 35 * scale, ry: 35 * scale, shape: 'square' },
    root: { rx: 32 * scale, ry: 32 * scale, shape: 'square' },
    spleen: { rx: 30 * scale, ry: 30 * scale, shape: 'triangle' },
    solar: { rx: 30 * scale, ry: 30 * scale, shape: 'triangle' },
  };

  // Render center shape
  const renderCenter = (
    center: keyof typeof centers,
    x: number,
    y: number,
    shape: { rx: number; ry: number; shape: string }
  ) => {
    const isDefined = centers[center];
    const fillColor = isDefined ? centerColors[center] : '#F1F5F9';
    const strokeColor = isDefined ? centerColors[center] : '#CBD5E1';
    const strokeWidth = isDefined ? 3 : 2;

    const shapeType = shape.shape;
    const size = shape.rx;

    if (shapeType === 'triangle') {
      const points = `${x},${y - size} ${x - size},${y + size * 0.7} ${x + size},${y + size * 0.7}`;
      return (
        <polygon
          points={points}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          className="transition-all duration-300 hover:opacity-80 cursor-pointer"
        />
      );
    } else if (shapeType === 'square') {
      return (
        <rect
          x={x - size}
          y={y - size}
          width={size * 2}
          height={size * 2}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          rx={4}
          className="transition-all duration-300 hover:opacity-80 cursor-pointer"
        />
      );
    } else if (shapeType === 'diamond') {
      const points = `${x},${y - size} ${x + size},${y} ${x},${y + size} ${x - size},${y}`;
      return (
        <polygon
          points={points}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          className="transition-all duration-300 hover:opacity-80 cursor-pointer"
        />
      );
    }
  };

  // Render channels (connections between centers)
  const renderChannels = () => {
    const channels = [
      { from: 'head', to: 'ajna', active: centers.head && centers.ajna },
      { from: 'ajna', to: 'throat', active: centers.ajna && centers.throat },
      { from: 'throat', to: 'g', active: centers.throat && centers.g },
      { from: 'heart', to: 'throat', active: centers.heart && centers.throat },
      { from: 'g', to: 'sacral', active: centers.g && centers.sacral },
      { from: 'sacral', to: 'root', active: centers.sacral && centers.root },
      { from: 'spleen', to: 'sacral', active: centers.spleen && centers.sacral },
      { from: 'solar', to: 'sacral', active: centers.solar && centers.sacral },
      { from: 'g', to: 'heart', active: centers.g && centers.heart },
      { from: 'g', to: 'spleen', active: centers.g && centers.spleen },
    ];

    return channels.map((channel, idx) => {
      const from = centerPositions[channel.from as keyof typeof centerPositions];
      const to = centerPositions[channel.to as keyof typeof centerPositions];
      
      return (
        <line
          key={idx}
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke={channel.active ? '#6366F1' : '#E2E8F0'}
          strokeWidth={channel.active ? 3 : 2}
          strokeDasharray={channel.active ? '0' : '5,5'}
          className="transition-all duration-300"
        />
      );
    });
  };

  return (
    <div className="relative flex justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 rounded-2xl p-8 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        className="relative z-10"
      >
        {/* Body outline (bodygraph shape) */}
        <g className="opacity-10">
          <path
            d={`M ${width * 0.5} ${height * 0.05} 
                L ${width * 0.3} ${height * 0.25}
                L ${width * 0.25} ${height * 0.5}
                L ${width * 0.3} ${height * 0.75}
                L ${width * 0.5} ${height * 0.95}
                L ${width * 0.7} ${height * 0.75}
                L ${width * 0.75} ${height * 0.5}
                L ${width * 0.7} ${height * 0.25}
                Z`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-slate-400 dark:text-slate-600"
          />
        </g>

        {/* Channels (connections between centers) */}
        <g className="channels">
          {renderChannels()}
        </g>

        {/* Centers */}
        <g className="centers">
          {Object.entries(centerPositions).map(([center, pos]) => (
            <g key={center}>
              {renderCenter(
                center as keyof typeof centers,
                pos.x,
                pos.y,
                centerShapes[center as keyof typeof centerShapes]
              )}
              {/* Center label */}
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[10px] font-bold fill-white dark:fill-slate-900 pointer-events-none"
              >
                {center.charAt(0).toUpperCase()}
              </text>
            </g>
          ))}
        </g>

        {/* Type label at bottom */}
        <text
          x={width * 0.5}
          y={height * 0.97}
          textAnchor="middle"
          className="text-xs font-semibold fill-slate-600 dark:fill-slate-400"
        >
          {type}
        </text>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 text-xs space-y-1.5">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-indigo-500 rounded"></div>
          <span className="text-slate-700 dark:text-slate-300">Defined</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600"></div>
          <span className="text-slate-700 dark:text-slate-300">Undefined</span>
        </div>
      </div>
    </div>
  );
};
