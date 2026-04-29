import { DIST_COLORS } from "@/lib/admin/colors";

type Props = {
  dist: readonly number[];
  width?: number;
  height?: number;
};

export function DistSpark({ dist, width = 52, height = 16 }: Props) {
  const max = Math.max(...dist, 1);
  const w = width / 5;
  return (
    <svg
      width={width}
      height={height}
      style={{ display: "block" }}
      aria-hidden
    >
      {dist.map((n, i) => {
        const h = (n / max) * (height - 2);
        return (
          <rect
            key={i}
            x={i * w + 1}
            y={height - h}
            width={w - 2}
            height={h}
            fill={DIST_COLORS[i]}
            rx={0.5}
            opacity={n === 0 ? 0.15 : 0.85}
          />
        );
      })}
    </svg>
  );
}
