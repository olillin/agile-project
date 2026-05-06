import type { TrendSeries } from "@/lib/admin/types";

type Props = {
  series: TrendSeries[];
  xLabels?: string[];
  width?: number;
  height?: number;
};

export function TrendChart({
  series,
  xLabels,
  width = 1000,
  height = 240,
}: Props) {
  const padL = 36,
    padR = 12,
    padT = 10,
    padB = 22;
  const w = width - padL - padR;
  const h = height - padT - padB;
  const allVals = series.flatMap(s => s.data);
  const max = Math.ceil(Math.max(...allVals, 5));
  const min = 0;
  const n = series[0]?.data.length ?? 0;
  const xStep = n > 1 ? w / (n - 1) : 0;
  const y = (v: number) => padT + h - ((v - min) / (max - min)) * h;
  const x = (i: number) => padL + i * xStep;
  const gridY = [1, 2, 3, 4, 5];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      style={{ display: "block", height: "auto", maxWidth: width }}
      aria-hidden
    >
      {gridY.map(v => (
        <g key={v}>
          <line
            x1={padL}
            x2={width - padR}
            y1={y(v)}
            y2={y(v)}
            stroke="rgba(26,24,21,0.06)"
            strokeDasharray="2 3"
          />
          <text
            x={padL - 8}
            y={y(v) + 3}
            className="text-meta"
            fill="var(--color-ink-soft)"
            textAnchor="end"
            fontFamily="var(--font-sans)"
          >
            {v}
          </text>
        </g>
      ))}
      {xLabels?.map((l, i) => (
        <text
          key={`${l}-${i}`}
          x={x(i)}
          y={height - 6}
          className="text-meta"
          fill="var(--color-ink-soft)"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
        >
          {l}
        </text>
      ))}
      {series.map(s => {
        const path = s.data
          .map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`)
          .join(" ");
        return (
          <g key={s.name}>
            <path
              d={path}
              stroke={s.color}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {s.data.map((v, i) => (
              <circle
                key={i}
                cx={x(i)}
                cy={y(v)}
                r={3}
                fill="var(--color-paper)"
                stroke={s.color}
                strokeWidth={1.5}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
