import { Button } from "@/components/admin/Button";
import { Card } from "@/components/admin/Card";
import { PageShell } from "@/components/admin/PageShell";
import { CommentList } from "@/components/admin/sections/CommentList";
import { RatingHistogram } from "@/components/admin/charts/RatingHistogram";
import { TagBars } from "@/components/admin/charts/TagBars";
import { TrendChart } from "@/components/admin/charts/TrendChart";
import { Pill } from "@/components/admin/Pill";
import { SectionHead } from "@/components/admin/SectionHead";
import { CupRating } from "@/components/brand/CupRating";
import { FOCUS_RING } from "@/lib/styles";
import {
  getCommentsForMeal,
  getMealById,
  MEAL_TAG_BARS,
  MEAL_TREND_SAMPLE,
  MEAL_TREND_X_LABELS,
  MEALS,
} from "@/lib/admin/fixtures";
import { NEW_TAG } from "@/lib/admin/types";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return MEALS.map(m => ({ id: m.id }));
}

type PageProps = { params: Promise<{ id: string }> };

function interpretDistribution(dist: readonly number[]): string {
  const lows = dist[0] ?? 0;
  const highs = dist[4] ?? 0;
  if (highs > lows * 4) return "strongly positive — most students love it.";
  if (lows > highs) return "polarized — many strong dislikes.";
  return "mixed.";
}

export default async function MealDetailPage({ params }: PageProps) {
  const { id } = await params;
  const meal = getMealById(id);
  if (!meal) notFound();

  const comments = getCommentsForMeal(meal.id);
  const total = meal.distribution.reduce((a, b) => a + b, 0);
  const avg =
    total > 0
      ? meal.distribution.reduce((s, n, i) => s + n * (i + 1), 0) / total
      : 0;
  const visibleTags = meal.tags.filter(t => t !== NEW_TAG);

  return (
    <PageShell
      title={
        <>
          <div style={{ marginBottom: 4 }}>
            <Link
              href="/admin/meals"
              className={`text-ink-soft hover:text-ink text-back inline-block rounded-sm transition-colors ${FOCUS_RING.cream}`}
              style={{ cursor: "pointer" }}
            >
              ← Meals
            </Link>
          </div>
          <span>{meal.name}</span>
        </>
      }
      subtitle={
        <div
          className="flex flex-wrap items-center"
          style={{ gap: 4 }}
        >
          <Pill tone="tea">{meal.line}</Pill>
          {visibleTags.map(t => (
            <Pill key={t} tone="neutral">
              {t}
            </Pill>
          ))}
        </div>
      }
      actions={
        <>
          <Button>Edit</Button>
          <Button primary>Schedule</Button>
        </>
      }
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <Card padding={18}>
          <div className="text-ink-soft text-eyebrow-lg uppercase">
            Average
          </div>
          <div
            className="flex items-baseline"
            style={{ gap: 8, marginTop: 4 }}
          >
            <div
              className="text-ink text-kpi font-serif"
              style={{ lineHeight: 1 }}
            >
              {avg.toFixed(1)}
            </div>
            <CupRating value={Math.round(avg)} size={14} />
          </div>
          <div
            className="text-ink-muted text-meta"
            style={{ marginTop: 8 }}
          >
            {total} ratings · {comments.length} comments
          </div>
        </Card>
        <Card padding={18}>
          <div className="text-ink-soft text-eyebrow-lg uppercase">
            Served
          </div>
          <div
            className="text-ink text-kpi font-serif"
            style={{ lineHeight: 1, marginTop: 4 }}
          >
            9<span className="text-ink-muted text-back"> ×</span>
          </div>
          <div
            className="text-ink-muted text-meta"
            style={{ marginTop: 8 }}
          >
            Last on {meal.lastServed}
          </div>
        </Card>
        <Card padding={18}>
          <div className="text-ink-soft text-eyebrow-lg uppercase">
            Climate
          </div>
          <div
            className="text-ink text-kpi font-serif"
            style={{ lineHeight: 1, marginTop: 4 }}
          >
            {meal.co2}
            <span
              className="text-ink-muted text-body"
              style={{ marginLeft: 4 }}
            >
              kg CO₂e
            </span>
          </div>
          <div
            className="text-ink-muted text-meta"
            style={{ marginTop: 8 }}
          >
            per portion
          </div>
        </Card>
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "1fr 1.5fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <Card>
          <SectionHead
            title="Rating distribution"
            sub="How students actually scored it"
          />
          <RatingHistogram dist={meal.distribution} total={total} />
          <div
            className="text-ink-muted text-meta border-ink/[0.06] border-t"
            style={{ marginTop: 14, paddingTop: 14, lineHeight: 1.5 }}
          >
            Distribution is {interpretDistribution(meal.distribution)}
          </div>
        </Card>
        <Card>
          <SectionHead
            title="Rating over time"
            sub="Each serving, most recent right"
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
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: "1fr 1.5fr", gap: 16 }}
      >
        <Card>
          <SectionHead
            title="What students said"
            sub="Quick-tag frequencies"
          />
          <TagBars items={MEAL_TAG_BARS} />
        </Card>
        <Card>
          <CommentList comments={comments} />
        </Card>
      </div>
    </PageShell>
  );
}
