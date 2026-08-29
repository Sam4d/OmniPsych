import React from 'react';

interface RadarDataPoint {
  axis: string;
  value: number; // 0 - 100
  benchmark?: number; // Optional comparison value
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  color?: string;
  benchmarkColor?: string;
  title?: string;
  subtitle?: string;
  showValues?: boolean;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  size = 360,
  color = '#6366F1',
  benchmarkColor = '#FF6B6B',
  title,
  subtitle,
  showValues = true
}) => {
  const numAxes = data.length;
  const center = size / 2;
  const radius = (size - 90) / 2;
  const angleSlice = (Math.PI * 2) / numAxes;

  // Concentric levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Helper to get coordinates
  const getCoordinates = (value: number, index: number, maxRadius: number = radius) => {
    const angle = index * angleSlice - Math.PI / 2;
    const r = (value / 100) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate primary polygon path
  const primaryPoints = data.map((d, i) => {
    const coords = getCoordinates(d.value, i);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  // Generate benchmark polygon path if available
  const hasBenchmark = data.some(d => d.benchmark !== undefined);
  const benchmarkPoints = hasBenchmark ? data.map((d, i) => {
    const coords = getCoordinates(d.benchmark || 0, i);
    return `${coords.x},${coords.y}`;
  }).join(' ') : '';

  return (
    <div className="flex flex-col items-center justify-center p-3 brutal-card bg-[#FFFDF9] relative">
      {title && (
        <div className="w-full flex items-center justify-between border-b-2 border-[#0F172A] pb-2 mb-2">
          <div>
            <h4 className="font-display font-bold text-sm tracking-tight uppercase">{title}</h4>
            {subtitle && <p className="text-[11px] text-slate-600 font-mono">{subtitle}</p>}
          </div>
          <span className="brutal-badge bg-[#FFE600] text-[10px]">RADAR // 6-AXIS</span>
        </div>
      )}

      <svg width={size} height={size} className="overflow-visible select-none">
        {/* Background Grid Concentric Polygons */}
        {levels.map((level, levelIdx) => {
          const levelPoints = data.map((_, i) => {
            const coords = getCoordinates(100 * level, i);
            return `${coords.x},${coords.y}`;
          }).join(' ');

          return (
            <polygon
              key={`level-${levelIdx}`}
              points={levelPoints}
              fill={levelIdx % 2 === 0 ? '#F8F6F0' : '#FFFFFF'}
              stroke="#0F172A"
              strokeWidth={levelIdx === levels.length - 1 ? 2 : 1}
              strokeDasharray={levelIdx === levels.length - 1 ? undefined : '2,2'}
            />
          );
        })}

        {/* Radial Axis Spokes */}
        {data.map((_, i) => {
          const coords = getCoordinates(100, i);
          return (
            <line
              key={`axis-line-${i}`}
              x1={center}
              y1={center}
              x2={coords.x}
              y2={coords.y}
              stroke="#0F172A"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Benchmark / Comparison Polygon */}
        {hasBenchmark && (
          <polygon
            points={benchmarkPoints}
            fill={benchmarkColor}
            fillOpacity="0.2"
            stroke={benchmarkColor}
            strokeWidth="2.5"
            strokeDasharray="4,4"
          />
        )}

        {/* Primary User Vector Polygon */}
        <polygon
          points={primaryPoints}
          fill={color}
          fillOpacity="0.45"
          stroke="#0F172A"
          strokeWidth="2.5"
        />

        {/* Coordinate Points & Values */}
        {data.map((d, i) => {
          const coords = getCoordinates(d.value, i);
          return (
            <g key={`point-${i}`}>
              <circle
                cx={coords.x}
                cy={coords.y}
                r="4.5"
                fill="#FFE600"
                stroke="#0F172A"
                strokeWidth="2"
              />
            </g>
          );
        })}

        {/* Axis Labels */}
        {data.map((d, i) => {
          const labelCoords = getCoordinates(120, i);
          return (
            <g key={`label-${i}`} transform={`translate(${labelCoords.x}, ${labelCoords.y})`}>
              <text
                textAnchor="middle"
                dominantBaseline="central"
                className="font-display font-bold text-[11px] fill-[#0F172A] tracking-tight uppercase"
              >
                {d.axis}
              </text>
              {showValues && (
                <text
                  y="12"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-mono font-bold text-[10px] fill-slate-700"
                >
                  {d.value}%
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend Footer */}
      <div className="mt-2 flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 brutal-border inline-block" style={{ backgroundColor: color }} />
          <span className="font-bold">Your UPG Vector</span>
        </div>
        {hasBenchmark && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 brutal-border inline-block" style={{ backgroundColor: benchmarkColor }} />
            <span className="font-bold">Partner / Benchmark</span>
          </div>
        )}
      </div>
    </div>
  );
};
