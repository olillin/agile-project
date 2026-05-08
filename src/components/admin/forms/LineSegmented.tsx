"use client";

import { LINE_COLOR, MEAL_LINES } from "@/lib/admin/colors";
import { FOCUS_RING } from "@/lib/styles";
import type { MealLine } from "@/lib/types";

type Props = {
  value: MealLine;
  onChange: (next: MealLine) => void;
};

export function LineSegmented({ value, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      className="bg-paper border-ink/[0.12] flex overflow-hidden rounded-[8px] border"
    >
      {MEAL_LINES.map((line, i) => {
        const active = value === line;
        const isLast = i === MEAL_LINES.length - 1;
        return (
          <button
            key={line}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(line)}
            className={`flex flex-1 cursor-pointer items-center justify-center font-medium transition-colors ${
              active ? "bg-ink text-paper" : "text-ink hover:bg-ink/5"
            } ${isLast ? "" : "border-ink/[0.08] border-r"} ${FOCUS_RING.paper}`}
            style={{
              padding: "9px 12px",
              gap: 8,
              fontSize: 12,
            }}
          >
            <span
              aria-hidden
              className="rounded-full"
              style={{
                width: 8,
                height: 8,
                background: LINE_COLOR[line],
              }}
            />
            {line}
          </button>
        );
      })}
    </div>
  );
}
