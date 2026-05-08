import type { CSSProperties, ReactNode } from "react";

export type PillTone =
  | "good"
  | "warn"
  | "bad"
  | "tea"
  | "neutral"
  | "tea-light";

export type PillShape = "round" | "square";

const TONE: Record<PillTone, string> = {
  good: "bg-sage/20 text-climate-low-deep",
  warn: "bg-amber/20 text-amber-deep",
  bad: "bg-rose/20 text-rose-deep",
  tea: "bg-tea/10 text-tea",
  neutral: "bg-ink/[0.06] text-ink-muted",
  "tea-light": "bg-tea-light/15 text-tea",
};

const SHAPE: Record<PillShape, string> = {
  round: "rounded-full",
  square: "rounded-[4px]",
};

type Props = {
  tone?: PillTone;
  shape?: PillShape;
  children: ReactNode;
  style?: CSSProperties;
};

export function Pill({
  tone = "neutral",
  shape = "round",
  children,
  style,
}: Props) {
  return (
    <span
      className={`inline-flex items-center justify-center font-semibold whitespace-nowrap ${SHAPE[shape]} ${TONE[tone]}`}
      style={{
        fontSize: 11,
        padding: "3px 8px",
        letterSpacing: 0,
        lineHeight: 1.4,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
