import { BackLink } from "@/components/admin/BackLink";
import { RatingHistogram } from "@/components/admin/charts/RatingHistogram";
import { TagBars } from "@/components/admin/charts/TagBars";
import { PageShell } from "@/components/admin/PageShell";
import { Pill } from "@/components/admin/Pill";
import { SectionHead } from "@/components/admin/SectionHead";
import { CommentList } from "@/components/admin/sections/CommentList";
import { MealTrendCard } from "@/components/admin/sections/MealTrendCard";
import { CupRating } from "@/components/brand/CupRating";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  interpretRatingDistribution,
  ratingAverage,
  ratingTotal,
} from "@/lib/admin/ratings";
import { NEW_TAG } from "@/lib/admin/types";
import { getAdminMealDetail } from "@/services/statisticsService";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ id: string }> };

export default async function MealDetailPage({ params }: PageProps) {
  const { id } = await params;
  const lunchId = Number(id);

  if (!Number.isInteger(lunchId) || lunchId <= 0) notFound();

  const meal = await getAdminMealDetail(lunchId);
  if (!meal) notFound();

  const comments = meal.comments;
  const total = ratingTotal(meal.distribution);
  const avg = ratingAverage(meal.distribution);
  const avgLabel = total > 0 ? avg.toFixed(1) : "—";
  const visibleTags = meal.tags.filter(t => t !== NEW_TAG);

  return (
    <PageShell
      title={
        <>
          <BackLink href="/admin/meals">← Meals</BackLink>
          <span>{meal.name}</span>
        </>
      }
      subtitle={
        <div className="flex flex-wrap items-center" style={{ gap: 4 }}>
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
          <Link
            href={`/admin/meals/${meal.id}/edit`}
            className={buttonClassName()}
          >
            Edit
          </Link>
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
          <div className="text-ink-soft text-eyebrow-lg uppercase">Average</div>
          <div className="flex items-baseline" style={{ gap: 8, marginTop: 4 }}>
            <div
              className="text-ink text-kpi font-serif"
              style={{ lineHeight: 1 }}
            >
              {avgLabel}
            </div>
            {total > 0 && <CupRating value={Math.round(avg)} size={14} />}
          </div>
          <div className="text-ink-muted text-meta" style={{ marginTop: 8 }}>
            {total} ratings · {comments.length} comments
          </div>
        </Card>
        <Card padding={18}>
          <div className="text-ink-soft text-eyebrow-lg uppercase">Served</div>
          <div
            className="text-ink text-kpi font-serif"
            style={{ lineHeight: 1, marginTop: 4 }}
          >
            {meal.timesServed ?? 0}
            <span className="text-ink-muted text-back"> times</span>
          </div>
          <div className="text-ink-muted text-meta" style={{ marginTop: 8 }}>
            Last {meal.lastServed}
          </div>
        </Card>
        <Card padding={18}>
          <div className="text-ink-soft text-eyebrow-lg uppercase">Climate</div>
          <div
            className="text-ink text-kpi font-serif"
            style={{ lineHeight: 1, marginTop: 4 }}
          >
            {meal.co2 ?? "—"}
            <span
              className="text-ink-muted text-body"
              style={{ marginLeft: 4 }}
            >
              kg CO₂e
            </span>
          </div>
          <div className="text-ink-muted text-meta" style={{ marginTop: 8 }}>
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
          <RatingHistogram dist={meal.distribution} />
          <div
            className="text-ink-muted text-meta border-ink/[0.06] border-t"
            style={{ marginTop: 14, paddingTop: 14, lineHeight: 1.5 }}
          >
            Distribution is {interpretRatingDistribution(meal.distribution)}
          </div>
        </Card>
        <MealTrendCard mealId={meal.id} initialTrend={meal.trend} />
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: "1fr 1.5fr", gap: 16 }}
      >
        <Card>
          <SectionHead title="What students said" sub="Quick-tag frequencies" />
          {meal.tagBars.length > 0 ? (
            <TagBars items={meal.tagBars} />
          ) : (
            <div
              className="text-ink-soft text-meta text-center"
              style={{ padding: "24px 0" }}
            >
              No tags yet.
            </div>
          )}
        </Card>
        <Card>
          <CommentList comments={comments} />
        </Card>
      </div>
    </PageShell>
  );
}
