"use client";

import { TAG_OPTIONS } from "@/lib/admin/types";
import { FOCUS_RING } from "@/lib/styles";
import type { DietTag } from "@/lib/types";

type Props = {
  value: readonly DietTag[];
  onToggle: (tag: DietTag) => void;
};

export function TagPicker({ value, onToggle }: Props) {
  return (
    <div className="flex flex-wrap" style={{ gap: 6 }}>
      {TAG_OPTIONS.map(tag => {
        const on = value.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(tag)}
            className={`cursor-pointer rounded-full border transition-colors ${FOCUS_RING.paper} ${
              on
                ? "bg-ink text-paper border-ink font-medium"
                : "text-ink-muted border-ink/[0.15] hover:border-ink/30 bg-transparent"
            }`}
            style={{
              padding: "6px 11px",
              fontSize: 12,
            }}
          >
            {on && <span style={{ marginRight: 4 }}>✓</span>}
            {tag}
          </button>
        );
      })}
    </div>
  );
}
