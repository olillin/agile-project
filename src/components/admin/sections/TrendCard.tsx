"use client";

import { Card } from "@/components/admin/Card";
import { TrendChart } from "@/components/admin/charts/TrendChart";
import { SectionHead } from "@/components/admin/SectionHead";
import {
  TREND_FOOTNOTES,
  TREND_SERIES,
  TREND_X_LABELS,
} from "@/lib/admin/fixtures";
import { FOCUS_RING } from "@/lib/styles";
import { useState } from "react";

type RangeKey = "7d" | "10d" | "1y";

const RANGE_KEYS: RangeKey[] = ["7d", "10d", "1y"];

const RANGE_SUBTITLE: Record<RangeKey, string> = {
  "7d": "Last 7 days",
  "10d": "Last 10 days",
  "1y": "Last year",
};

export function TrendCard() {
  const [range, setRange] = useState<RangeKey>("10d");

  return (
    <Card style={{ minWidth: 0, overflow: "hidden" }}>
      <SectionHead
        title="Daily average"
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
                  onClick={() => setRange(t)}
                  isFirst={i === 0}
                />
              ))}
            </div>
          </div>
        }
      />
      <TrendChart
        series={TREND_SERIES}
        xLabels={TREND_X_LABELS}
        width={1000}
        height={240}
      />
      <div
        className="text-ink-muted text-meta flex flex-wrap items-center"
        style={{ gap: 14, marginTop: 8 }}
      >
        {TREND_SERIES.map(s => (
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
        {TREND_FOOTNOTES.map(s => (
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
