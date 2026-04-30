"use client";

import { Card } from "@/components/admin/Card";
import { TrendChart } from "@/components/admin/charts/TrendChart";
import { SectionHead } from "@/components/admin/SectionHead";
import { MEAL_TREND_SAMPLE, MEAL_TREND_X_LABELS } from "@/lib/admin/fixtures";
import { FOCUS_RING } from "@/lib/styles";
import { useState } from "react";

type RangeKey = "10" | "30" | "100";

const RANGE_KEYS: RangeKey[] = ["10", "30", "100"];

export function MealTrendCard() {
  const [range, setRange] = useState<RangeKey>("30");

  return (
    <Card>
      <SectionHead
        title="Rating over time"
        sub={`Last ${range} servings · most recent right`}
        right={
          <div
            className="text-ink-soft text-meta flex items-center font-medium"
            style={{ gap: 6 }}
          >
            <span>Servings</span>
            <div
              className="bg-paper border-ink/[0.10] flex overflow-hidden border"
              style={{ borderRadius: 7 }}
            >
              {RANGE_KEYS.map((t, i) => (
                <RangeItem
                  key={t}
                  label={t}
                  active={range === t}
                  onClick={() => setRange(t)}
                  isFirst={i === 0}
                />
              ))}
            </div>
          </div>
        }
      />
      <TrendChart
        width={560}
        height={200}
        xLabels={MEAL_TREND_X_LABELS}
        series={[
          {
            name: "avg",
            color: "var(--color-tea)",
            data: MEAL_TREND_SAMPLE,
          },
        ]}
      />
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
