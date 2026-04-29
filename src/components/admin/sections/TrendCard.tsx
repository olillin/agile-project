import { Card } from "@/components/admin/Card";
import { TrendChart } from "@/components/admin/charts/TrendChart";
import { SectionHead } from "@/components/admin/SectionHead";
import {
  TREND_FOOTNOTES,
  TREND_SERIES,
  TREND_X_LABELS,
} from "@/lib/admin/fixtures";

export function TrendCard() {
  return (
    <Card style={{ minWidth: 0, overflow: "hidden" }}>
      <SectionHead title="Daily average · last 3 weeks" sub="By line" />
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
          <div
            key={s.name}
            className="flex items-center"
            style={{ gap: 5 }}
          >
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
            <div className="text-ink-soft text-eyebrow uppercase">{s.label}</div>
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
