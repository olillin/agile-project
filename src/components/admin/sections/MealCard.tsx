import { DistSpark } from "@/components/admin/charts/DistSpark";
import { MealThumb } from "@/components/admin/MealThumb";
import { Pill } from "@/components/admin/Pill";
import { CupRating } from "@/components/brand/CupRating";
import { climateTone, ratingColor } from "@/lib/admin/colors";
import { NEW_TAG } from "@/lib/admin/types";
import type { MealStat } from "@/lib/admin/types";
import { FOCUS_RING } from "@/lib/styles";
import Link from "next/link";

type Props = { meal: MealStat };

export function MealCard({ meal }: Props) {
  const tone = climateTone(meal.climate);
  const visibleTags = meal.tags.filter(t => t !== NEW_TAG).slice(0, 3);

  return (
    <Link
      href={`/admin/meals/${meal.id}`}
      className={`bg-paper border-ink/[0.06] flex flex-col overflow-hidden border transition-shadow hover:shadow-[0_4px_18px_rgba(26,24,21,0.10)] ${FOCUS_RING.cream}`}
      style={{ borderRadius: 12 }}
    >
      <div className="w-full overflow-hidden" style={{ aspectRatio: "4 / 3" }}>
        <MealThumb meal={meal} />
      </div>
      <div className="flex flex-1 flex-col" style={{ padding: 12, gap: 8 }}>
        <div>
          <div
            className="text-ink text-body font-semibold"
            style={{ lineHeight: 1.3 }}
          >
            {meal.name}
          </div>
          <div
            className="text-ink-soft text-caption uppercase"
            style={{ marginTop: 3 }}
          >
            {meal.line}
          </div>
          {visibleTags.length > 0 && (
            <div className="flex flex-wrap" style={{ gap: 4, marginTop: 6 }}>
              {visibleTags.map(t => (
                <Pill key={t} tone="neutral">
                  {t}
                </Pill>
              ))}
            </div>
          )}
        </div>

        {meal.rating != null ? (
          <div
            className="flex items-center justify-between"
            style={{ marginTop: 2 }}
          >
            <div className="flex items-baseline" style={{ gap: 6 }}>
              <span
                className="text-section font-serif"
                style={{ color: ratingColor(meal.rating), lineHeight: 1 }}
              >
                {meal.rating.toFixed(1)}
              </span>
              <CupRating value={Math.round(meal.rating)} size={9} />
            </div>
            <DistSpark dist={meal.distribution} />
          </div>
        ) : (
          <div
            className="text-amber bg-amber/10 text-meta text-center font-medium"
            style={{ padding: "6px 10px", borderRadius: 6 }}
          >
            Not yet served
          </div>
        )}

        <div
          className="border-ink/[0.06] text-ink-soft text-tiny flex flex-wrap items-center justify-between border-t"
          style={{ paddingTop: 8, gap: 8 }}
        >
          <span className="tabular-nums">
            {meal.rating != null ? `${meal.votes} votes` : "—"}
          </span>
          <span className="tabular-nums">Last {meal.lastServed}</span>
          <span className="tabular-nums">
            {meal.co2 != null ? `${meal.co2} kg CO₂e` : "—"}
          </span>
          {tone && <Pill tone={tone}>{meal.climate}</Pill>}
        </div>
      </div>
    </Link>
  );
}
