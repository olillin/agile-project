"use client";

import { Dialog } from "@/components/admin/Dialog";
import { Button } from "@/components/ui/Button";
import { unscheduleServing } from "@/services/lunchService";
import type { UpcomingServing } from "@/services/statisticsService";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  upcomingServings: UpcomingServing[];
};

function formatUpcoming(dateKey: string): string {
  const date = new Date(`${dateKey}T00:00:00`);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

export function UpcomingServingsSection({ upcomingServings }: Props) {
  const router = useRouter();
  const [removing, setRemoving] = useState<UpcomingServing | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeConfirm = () => {
    if (submitting) return;
    setRemoving(null);
    setError(null);
  };

  const confirm = async () => {
    if (!removing || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await unscheduleServing(removing.id);
      setRemoving(null);
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error && e.message
          ? e.message
          : "Failed to remove. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (upcomingServings.length === 0) {
    return (
      <div
        className="text-ink-soft text-meta text-center"
        style={{ padding: "16px 0" }}
      >
        Nothing scheduled.
      </div>
    );
  }

  return (
    <>
      <ul className="flex flex-col" style={{ gap: 6 }}>
        {upcomingServings.map(serving => (
          <li
            key={serving.id}
            className="border-ink/[0.06] flex items-center justify-between rounded-[8px] border"
            style={{ padding: "8px 12px" }}
          >
            <span className="text-ink text-meta tabular-nums">
              {formatUpcoming(serving.date)}
            </span>
            <Button danger type="button" onClick={() => setRemoving(serving)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <Dialog
        open={removing !== null}
        onClose={closeConfirm}
        preventClose={submitting}
        title="Remove scheduled serving?"
        footer={
          <>
            <Button type="button" onClick={closeConfirm} disabled={submitting}>
              Keep it
            </Button>
            <Button
              primary
              danger
              type="button"
              onClick={confirm}
              disabled={submitting}
            >
              {submitting ? "Removing…" : "Remove"}
            </Button>
          </>
        }
      >
        {removing ? (
          <>
            <p>This will unschedule {formatUpcoming(removing.date)}.</p>
            {error && (
              <p className="text-rose-deep text-meta" style={{ marginTop: 10 }}>
                {error}
              </p>
            )}
          </>
        ) : null}
      </Dialog>
    </>
  );
}
