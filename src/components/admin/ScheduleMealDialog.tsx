"use client";

import { Dialog } from "@/components/admin/Dialog";
import { Field } from "@/components/admin/forms/Field";
import { TextInput } from "@/components/admin/forms/TextInput";
import { Button } from "@/components/ui/Button";
import { scheduleServing } from "@/services/lunchService";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  mealId: number;
  mealName: string;
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatPretty(dateKey: string): string {
  const date = new Date(`${dateKey}T00:00:00`);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function ScheduleMealDialog({ mealId, mealName }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(todayKey);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduledDate, setScheduledDate] = useState<string | null>(null);

  const openDialog = () => {
    setDate(todayKey());
    setError(null);
    setScheduledDate(null);
    setOpen(true);
  };

  const close = () => {
    if (submitting) return;
    setOpen(false);
  };

  const submit = async () => {
    if (submitting || !date) return;
    setSubmitting(true);
    setError(null);
    try {
      await scheduleServing(mealId, date);
      router.refresh();
      setScheduledDate(date);
    } catch (e) {
      setError(
        e instanceof Error && e.message
          ? e.message
          : "Failed to schedule. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button primary onClick={openDialog}>
        Schedule
      </Button>
      <Dialog
        open={open}
        onClose={close}
        preventClose={submitting}
        title={scheduledDate ? "Scheduled" : "Schedule serving"}
        footer={
          scheduledDate ? (
            <Button primary type="button" onClick={close}>
              Close
            </Button>
          ) : (
            <>
              <Button type="button" onClick={close} disabled={submitting}>
                Cancel
              </Button>
              <Button
                primary
                type="button"
                onClick={submit}
                disabled={submitting || !date}
              >
                {submitting ? "Scheduling…" : "Schedule"}
              </Button>
            </>
          )
        }
      >
        {scheduledDate ? (
          <p>
            <strong>{mealName}</strong> is scheduled for{" "}
            {formatPretty(scheduledDate)}.
          </p>
        ) : (
          <>
            <p style={{ marginBottom: 14 }}>
              Pick a date to serve <strong>{mealName}</strong>.
            </p>
            <div style={{ textAlign: "left" }}>
              <Field label="Date">
                <TextInput
                  type="date"
                  value={date}
                  onChange={setDate}
                  min={todayKey()}
                  autoFocus
                />
              </Field>
            </div>
            {error && (
              <p
                className="text-rose-deep text-meta"
                style={{ marginTop: 12, textAlign: "center" }}
              >
                {error}
              </p>
            )}
          </>
        )}
      </Dialog>
    </>
  );
}
