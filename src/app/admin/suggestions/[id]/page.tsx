import { BackLink } from "@/components/admin/BackLink";
import { PageShell } from "@/components/admin/PageShell";
import { Pill } from "@/components/admin/Pill";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SUGGESTIONS } from "@/lib/admin/fixtures";
import { formatPostedDate } from "@/lib/dateFormat";
import {
  getSuggestionById,
  isNewSuggestion,
} from "@/services/suggestionService";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return SUGGESTIONS.map(suggestion => ({ id: suggestion.id.toString() }));
}

type PageProps = { params: Promise<{ id: string }> };

export default async function MealDetailPage({ params }: PageProps) {
  const { id } = await params;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) notFound();
  const suggestion = await getSuggestionById(parsedId);
  if (!suggestion) notFound();

  const isNew = isNewSuggestion(suggestion);

  return (
    <PageShell
      title={
        <>
          <BackLink href="/admin/suggestions">← Suggestions</BackLink>
          <span>{suggestion.title}</span>
        </>
      }
      subtitle={
        <div className="flex flex-wrap items-center" style={{ gap: 4 }}>
          {isNew && <Pill tone="warn">New</Pill>}
        </div>
      }
      actions={
        <>
          {
            // TODO: Add actual actions
          }
          <Link
            href={`/admin/suggestions/${suggestion.id}/approve`}
            className={buttonClassName()}
          >
            Approve
          </Link>
          <Link
            href={`/admin/suggestions/${suggestion.id}/deny`}
            className={buttonClassName()}
          >
            Deny
          </Link>
        </>
      }
    >
      <div className="grid-rows-[1fr 2em] mb-4 grid gap-4">
        <Card>
          <div className="text-ink-soft text-eyebrow-lg uppercase">
            Description
          </div>
          <p className="text-body mt-1">{suggestion.description}</p>
        </Card>
        <span className="text-meta text-ink-muted">
          Left {formatPostedDate(suggestion.postedDate)}
          {suggestion.userDisplayName
            ? " by " + suggestion.userDisplayName
            : ""}
        </span>
      </div>
    </PageShell>
  );
}
