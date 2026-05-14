"use client";

import { FOCUS_RING } from "@/lib/styles";
import { useState } from "react";
import { Card } from "../ui/Card";

export function SuggestForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const isComplete = title && description;
  const buttonLabel = isComplete
    ? "Submit suggestion"
    : "Complete form to submit";

  return (
    <Card className="m-4">
      <form method="POST" action="/api/suggest">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-l font-serif">
            Title
          </label>
          <input
            type="text"
            onChange={e => setTitle(e.target.value.trim())}
            name="title"
            placeholder="What I want is..."
            className="border-ink/10 bg-cream text-ink mt-1 w-full rounded-[12px] border px-3 py-2.5 outline-none"
          />

          <label htmlFor="description" className="text-l mt-4 font-serif">
            Description
          </label>
          <textarea
            onChange={e => setDescription(e.target.value.trim())}
            name="description"
            placeholder="I want this because..."
            rows={4}
            className="border-ink/10 bg-cream text-ink mt-1 w-full resize-none rounded-[12px] border px-3 py-2.5 outline-none"
          />

          <button
            type="submit"
            disabled={!isComplete}
            className={`text-body mt-6 w-full rounded-[14px] p-2 font-semibold transition-colors ${FOCUS_RING.cream} ${
              isComplete
                ? "bg-ink text-paper cursor-pointer"
                : "bg-ink/10 text-ink-muted cursor-not-allowed"
            }`}
          >
            {buttonLabel}
          </button>
        </div>
      </form>
    </Card>
  );
}
