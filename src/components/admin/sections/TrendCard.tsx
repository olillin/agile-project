"use client";

import { TrendChart } from "@/components/admin/charts/TrendChart";
import { SectionHead } from "@/components/admin/SectionHead";
import { Card } from "@/components/ui/Card";
import { FOCUS_RING } from "@/lib/styles";
import type { AdminOverviewTrend } from "@/services/statisticsService";
import { useState } from "react";

type RangeKey = "7d" | "30d" | "1y";

const RANGE_KEYS: RangeKey[] = ["7d", "30d", "1y"];

const RANGE_SUBTITLE: Record<RangeKey, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "1y": "Last year",
};

type Props = {
  initialTrend: AdminOverviewTrend;
};

export function TrendCard({ initialTrend }: Props) {
  const [range, setRange] = useState<RangeKey>("30d");
  const [trend, setTrend] = useState(initialTrend);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const selectRange = async (nextRange: RangeKey) => {
    if (nextRange === range || isLoading) return;

    setRange(nextRange);
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await fetch(
        `/api/admin/analytics/overview?range=${nextRange}`,
        { cache: "no-store" }
      );

      if (!response.ok) throw new Error("Failed to load trend");

      setTrend((await response.json()) as AdminOverviewTrend);
    } catch (error) {
      console.error("Failed to load overview trend", error);
      setLoadError("Could not load this range.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card style={{ minWidth: 0, overflow: "hidden" }}>
      <SectionHead
        title={range === "1y" ? "Weekly average" : "Daily average"}
        sub={`${RANGE_SUBTITLE[range]} · by line`}
        right={
          <div
            className="text-ink-soft text-meta flex items-center font-medium"
            style={{ gap: 6 }}
          >
            <span>Range</span>
            <div
              className="bg-paper border-ink/[0.10] flex overflow-hidden border"
              style={{ borderRadius: 7 }}
            >
              {RANGE_KEYS.map((t, i) => (
                <RangeItem
                  key={t}
                  label={t}
                  active={range === t}
                  onClick={() => selectRange(t)}
                  isFirst={i === 0}
                />
              ))}
            </div>
          </div>
        }
      />
      <div className="relative">
        <div
          style={{
            opacity: isLoading ? 0.5 : 1,
            transition: "opacity 120ms ease-out",
          }}
        >
          <TrendChart
            series={trend.series}
            xLabels={trend.xLabels}
            width={1000}
            height={240}
          />
        </div>
        {isLoading && (
          <div
            className="text-ink-soft text-meta absolute inset-0 flex items-center justify-center"
            aria-live="polite"
          >
            Loading…
          </div>
        )}
      </div>
      {loadError && (
        <div className="text-rose text-meta" style={{ marginTop: 8 }}>
          {loadError}
        </div>
      )}
      <div
        className="text-ink-muted text-meta flex flex-wrap items-center"
        style={{ gap: 14, marginTop: 8 }}
      >
        {trend.series.map(s => (
          <div key={s.name} className="flex items-center" style={{ gap: 5 }}>
            <span
              style={{
                width: 10,
                height: 2,
                background: s.color,
                borderRadius: 1,
                display: "inline-block",
              }}
            />
            {s.name}
          </div>
        ))}
      </div>
      <div
        className="border-ink/[0.06] grid border-t"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginTop: 18,
          paddingTop: 18,
        }}
      >
        {trend.footnotes.map(s => (
          <div key={s.label}>
            <div className="text-ink-soft text-eyebrow uppercase">
              {s.label}
            </div>
            <div
              className="text-feature font-serif"
              style={{ color: s.tone, marginTop: 4 }}
            >
              {s.value}
            </div>
            <div
              className="text-ink-muted text-meta"
              style={{ marginTop: 2, lineHeight: 1.4 }}
            >
              {s.sub}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RangeItem({
  label,
  active,
  onClick,
  isFirst,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  isFirst?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`text-meta font-medium ${
        active ? "bg-ink text-paper" : "text-ink"
      } ${FOCUS_RING.cream}`}
      style={{
        padding: "6px 11px",
        cursor: "pointer",
        borderLeft: isFirst ? "none" : "1px solid rgba(26,24,21,0.10)",
      }}
    >
      {label}
    </button>
  );
}
