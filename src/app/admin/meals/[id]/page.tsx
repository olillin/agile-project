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
  getCommentsForMeal,
  getMealById,
  MEAL_TAG_BARS,
} from "@/lib/admin/fixtures";
import {
  interpretRatingDistribution,
  ratingAverage,
  ratingTotal,
} from "@/lib/admin/ratings";
import { NEW_TAG } from "@/lib/admin/types";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ id: string }> };

export default async function MealDetailPage({ params }: PageProps) {
  const { id } = await params;
  const meal = getMealById(id);
  if (!meal) notFound();

  const comments = getCommentsForMeal(meal.id);
  const total = ratingTotal(meal.distribution);
  const avg = ratingAverage(meal.distribution);
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
              {avg.toFixed(1)}
            </div>
            <CupRating value={Math.round(avg)} size={14} />
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
            9<span className="text-ink-muted text-back"> times</span>
          </div>
          <div className="text-ink-muted text-meta" style={{ marginTop: 8 }}>
            Last on {meal.lastServed}
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
        <MealTrendCard />
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: "1fr 1.5fr", gap: 16 }}
      >
        <Card>
          <SectionHead title="What students said" sub="Quick-tag frequencies" />
          <TagBars items={MEAL_TAG_BARS} />
        </Card>
        <Card>
          <CommentList comments={comments} />
        </Card>
      </div>
    </PageShell>
  );
}
