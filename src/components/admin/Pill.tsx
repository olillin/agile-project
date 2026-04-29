import type { ReactNode } from "react";

export type PillTone =
  | "good"
  | "warn"
  | "bad"
  | "tea"
  | "neutral"
  | "tea-light";

const TONE: Record<PillTone, string> = {
  good: "bg-sage/20 text-climate-low-deep",
  warn: "bg-amber/20 text-amber-deep",
  bad: "bg-rose/20 text-rose-deep",
  tea: "bg-tea/10 text-tea",
  neutral: "bg-ink/[0.06] text-ink-muted",
  "tea-light": "bg-tea-light/15 text-tea",
};

type Props = {
  tone?: PillTone;
  children: ReactNode;
};

export function Pill({ tone = "neutral", children }: Props) {
  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold ${TONE[tone]}`}
      style={{
        fontSize: 11,
        padding: "3px 8px",
        letterSpacing: 0.4,
        lineHeight: 1.4,
      }}
    >
      {children}
    </span>
  );
}
