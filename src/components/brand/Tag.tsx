import type { ClimateLabel } from "@/lib/types";

export type TagTone = "tea" | `climate-${ClimateLabel}`;

const TONE_STYLES: Record<TagTone, string> = {
  tea: "bg-tea/10 text-tea",
  "climate-low": "bg-climate-low/15 text-climate-low-deep",
  "climate-medium": "bg-amber/20 text-amber-deep",
  "climate-high": "bg-rose/20 text-rose-deep",
};

type Props = {
  children: React.ReactNode;
  tone?: TagTone;
  icon?: React.ReactNode;
};

export function Tag({ children, tone = "tea", icon }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${TONE_STYLES[tone]}`}
      style={{ fontSize: 11, padding: "4px 9px" }}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
}
