import { NEW_TAG } from "@/lib/admin/types";
import type { MealStat } from "@/lib/admin/types";
import { Pill } from "./Pill";

type Props = {
  meal: Pick<MealStat, "id" | "tags">;
  showNewBadge?: boolean;
};

export function MealThumb({ meal, showNewBadge = true }: Props) {
  const hash = meal.id
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0);
  const baseH = (hash * 37) % 360;
  const bg = `hsl(${baseH} 35% 78%)`;
  const accent = `hsl(${(baseH + 40) % 360} 45% 62%)`;
  const dark = `hsl(${baseH} 30% 35%)`;

  const tags = meal.tags;
  const hasRice = tags.includes("rice") || tags.includes("curry");
  const hasPasta = tags.includes("pasta");
  const hasSoup = tags.includes("soup");
  const hasBowl = tags.includes("bowl");
  const isNew = tags.includes(NEW_TAG);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: bg }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 120 90"
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block" }}
        aria-hidden
      >
        <ellipse cx="60" cy="56" rx="44" ry="20" fill="rgba(255,255,255,0.55)" />
        <ellipse cx="60" cy="54" rx="38" ry="17" fill="rgba(255,255,255,0.8)" />
        {hasSoup && (
          <>
            <ellipse cx="60" cy="54" rx="30" ry="13" fill={accent} />
            <ellipse
              cx="52"
              cy="51"
              rx="3"
              ry="1"
              fill="rgba(255,255,255,0.5)"
            />
            <ellipse
              cx="66"
              cy="53"
              rx="2"
              ry="0.8"
              fill="rgba(255,255,255,0.5)"
            />
          </>
        )}
        {hasPasta && (
          <>
            <path
              d="M30 52 Q40 44 50 52 T70 52 T90 52"
              stroke={accent}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M32 56 Q42 48 52 56 T72 56 T88 56"
              stroke={dark}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.6"
            />
            <circle cx="48" cy="50" r="2" fill={dark} opacity="0.8" />
            <circle cx="68" cy="54" r="1.8" fill={dark} opacity="0.8" />
          </>
        )}
        {hasRice && (
          <g fill={accent}>
            {Array.from({ length: 30 }).map((_, i) => {
              const cx = 36 + ((i * 37) % 48);
              const cy = 47 + ((i * 13) % 14);
              const rot = (i * 27) % 90;
              return (
                <ellipse
                  key={i}
                  cx={cx}
                  cy={cy}
                  rx="1.3"
                  ry="0.8"
                  transform={`rotate(${rot} ${cx} ${cy})`}
                />
              );
            })}
          </g>
        )}
        {hasBowl && (
          <>
            <circle cx="60" cy="54" r="18" fill={accent} opacity="0.7" />
            <circle cx="55" cy="50" r="4" fill={dark} opacity="0.5" />
            <circle cx="65" cy="55" r="3" fill={dark} opacity="0.4" />
            <circle cx="60" cy="58" r="2.5" fill={dark} opacity="0.6" />
          </>
        )}
        {!hasSoup && !hasPasta && !hasRice && !hasBowl && (
          <>
            <ellipse cx="60" cy="52" rx="22" ry="10" fill={accent} />
            <ellipse cx="54" cy="48" rx="6" ry="3" fill={dark} opacity="0.35" />
            <ellipse cx="68" cy="52" rx="5" ry="2.5" fill={dark} opacity="0.3" />
          </>
        )}
        <circle cx="44" cy="46" r="1.2" fill="var(--color-sage)" />
        <circle cx="78" cy="50" r="1" fill="var(--color-sage)" />
        <circle cx="62" cy="44" r="0.8" fill="var(--color-sage)" />
      </svg>
      {showNewBadge && isNew && (
        <div className="absolute" style={{ top: 8, left: 8 }}>
          <Pill tone="warn">NEW</Pill>
        </div>
      )}
    </div>
  );
}
