import React, { useId } from "react";

interface BlockRadarProps {
  /** Accuracy 0–100 for blocks 1–7. */
  values: number[];
  size?: number;
}

/**
 * Lightweight SVG heptagon radar for per-block mastery (no chart dep).
 * Decorative (`aria-hidden`); numeric values are listed alongside.
 */
export const BlockRadar: React.FC<BlockRadarProps> = ({
  values,
  size = 220,
}) => {
  const id = useId();
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 28;
  const n = 7;

  const point = (axis: number, frac: number): [number, number] => {
    const angle = (2 * Math.PI * axis) / n - Math.PI / 2;
    return [cx + radius * frac * Math.cos(angle), cy + radius * frac * Math.sin(angle)];
  };

  const rings = [0.25, 0.5, 0.75, 1];
  const data = values.map((v) => Math.max(0, Math.min(100, v)) / 100);
  const polygon = data
    .map((f, i) => {
      const [x, y] = point(i, f);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-hidden="true"
      className="mx-auto"
    >
      {rings.map((r) => (
        <polygon
          key={`${id}-ring-${r}`}
          points={Array.from({ length: n }, (_, i) => {
            const [x, y] = point(i, r);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(" ")}
          fill="none"
          stroke="currentColor"
          strokeOpacity={r === 1 ? 0.35 : 0.15}
          strokeWidth={1}
          className="text-slate-400"
        />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const [x, y] = point(i, 1);
        const [lx, ly] = point(i, 1.16);
        return (
          <g key={`${id}-axis-${i}`}>
            <line
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.15}
              strokeWidth={1}
              className="text-slate-400"
            />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={11}
              fontWeight={700}
              className="fill-slate-500"
            >
              {`B${i + 1}`}
            </text>
          </g>
        );
      })}
      <polygon
        points={polygon}
        fill="rgb(14 165 233 / 0.25)"
        stroke="#0284c7"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {data.map((f, i) => {
        const [x, y] = point(i, f);
        return (
          <circle
            key={`${id}-dot-${i}`}
            cx={x}
            cy={y}
            r={3}
            fill={f >= 0.75 ? "#059669" : f >= 0.5 ? "#d97706" : "#e11d48"}
            stroke="#fff"
            strokeWidth={1}
          />
        );
      })}
    </svg>
  );
};

interface TrendSparklineProps {
  /** Chronological values (oldest → newest). */
  points: number[];
  width?: number;
  height?: number;
  stroke?: string;
}

/**
 * Minimal inline SVG trend line for exam grades over time.
 */
export const TrendSparkline: React.FC<TrendSparklineProps> = ({
  points,
  width = 220,
  height = 48,
  stroke = "#0284c7",
}) => {
  if (points.length === 0) return null;
  const min = Math.min(...points, 0);
  const max = Math.max(...points, 30);
  const span = Math.max(1, max - min);
  const step = points.length > 1 ? width / (points.length - 1) : 0;
  const coords = points.map(
    (p, i) =>
      `${(i * step).toFixed(1)},${(height - 4 - ((p - min) / span) * (height - 8)).toFixed(1)}`,
  );
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-hidden="true"
      className="overflow-visible"
    >
      <polyline
        points={coords.join(" ")}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {coords.map((pt, i) => {
        const [x, y] = pt.split(",");
        return (
          <circle
            key={i}
            cx={Number(x)}
            cy={Number(y)}
            r={2.5}
            fill={stroke}
            stroke="#fff"
            strokeWidth={1}
          />
        );
      })}
    </svg>
  );
};
