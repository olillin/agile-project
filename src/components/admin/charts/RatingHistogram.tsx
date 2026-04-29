import { TeaCup } from "@/components/brand/TeaCup";
import { DIST_COLORS } from "@/lib/admin/colors";

type Props = {
  dist: readonly number[];
  total: number;
};

export function RatingHistogram({ dist, total }: Props) {
  return (
    <div className="flex w-full flex-col" style={{ gap: 6 }}>
      {[5, 4, 3, 2, 1].map(star => {
        const i = star - 1;
        const n = dist[i] ?? 0;
        const sharePct = total === 0 ? 0 : (n / total) * 100;
        return (
          <div
            key={star}
            className="flex items-center"
            style={{ gap: 10 }}
          >
            <div
              className="text-ink-muted text-meta flex items-center tabular-nums"
              style={{ width: 50, gap: 4 }}
            >
              {star}
              <TeaCup size={11} fill={1} />
            </div>
            <div
              className="flex-1 overflow-hidden rounded-[3px] bg-ink/[0.04]"
              style={{ height: 14 }}
            >
              <div
                className="h-full rounded-[3px]"
                style={{ width: `${sharePct}%`, background: DIST_COLORS[i] }}
              />
            </div>
            <div
              className="text-ink-soft text-meta text-right tabular-nums"
              style={{ width: 72 }}
            >
              {n} · {sharePct.toFixed(0)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
