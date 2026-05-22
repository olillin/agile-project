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

const FORM_ID = "schedule-meal-form";

function tomorrowKey(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
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
  const [date, setDate] = useState(tomorrowKey);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduledDate, setScheduledDate] = useState<string | null>(null);

  const openDialog = () => {
    setDate(tomorrowKey());
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
      <Button primary type="button" onClick={openDialog}>
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
                type="submit"
                form={FORM_ID}
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
          <form
            id={FORM_ID}
            onSubmit={e => {
              e.preventDefault();
              submit();
            }}
          >
            <p style={{ marginBottom: 14 }}>
              Pick a date to serve <strong>{mealName}</strong>.
            </p>
            <div style={{ textAlign: "left" }}>
              <Field label="Date">
                <TextInput
                  type="date"
                  value={date}
                  onChange={setDate}
                  min={tomorrowKey()}
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
          </form>
        )}
      </Dialog>
    </>
  );
}
