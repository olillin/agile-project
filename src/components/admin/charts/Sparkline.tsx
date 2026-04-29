type Props = {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  fill?: string;
};

export function Sparkline({
  data,
  color = "var(--color-tea)",
  width = 64,
  height = 32,
  fill,
}: Props) {
  if (data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = data.length === 1 ? 0 : width / (data.length - 1);
  const pts = data.map<[number, number]>((d, i) => [
    i * step,
    height - ((d - min) / range) * (height - 4) - 2,
  ]);
  const path = pts
    .map(
      (p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`
    )
    .join(" ");
  const area = fill ? `${path} L${width},${height} L0,${height} Z` : null;
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} style={{ display: "block" }} aria-hidden>
      {area && <path d={area} fill={fill} opacity={0.3} />}
      <path
        d={path}
        stroke={color}
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last[0]} cy={last[1]} r={2.5} fill={color} />
    </svg>
  );
}
