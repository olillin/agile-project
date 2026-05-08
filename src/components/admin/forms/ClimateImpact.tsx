"use client";

import { Button } from "@/components/ui/Button";
import { kgToBucket } from "@/lib/admin/colors";
import type {
  ClimateBucket,
  ClimateFormState,
  IngredientRow,
} from "@/lib/admin/types";
import { calculateClimate } from "@/services/mealService";

type Props = {
  rows: IngredientRow[];
  state: ClimateFormState;
  onChange: (next: ClimateFormState) => void;
};

const isValidRow = (r: IngredientRow) =>
  r.name.trim().length > 0 && r.amount.trim().length > 0;

type Tone = { color: string; bg: string; label: string };

const IDLE_TONE: Tone = {
  color: "var(--color-ink-muted)",
  bg: "transparent",
  label: "",
};

const TONES: Record<NonNullable<ClimateBucket>, Tone> = {
  low: {
    color: "var(--color-sage)",
    bg: "rgb(143 166 122 / 0.15)",
    label: "low impact",
  },
  med: {
    color: "var(--color-amber)",
    bg: "rgb(196 128 58 / 0.15)",
    label: "moderate",
  },
  high: {
    color: "var(--color-rose)",
    bg: "rgb(200 120 101 / 0.15)",
    label: "higher impact",
  },
};

const toneFor = (kg: number | null): Tone => {
  const bucket = kgToBucket(kg);
  return bucket ? TONES[bucket] : IDLE_TONE;
};

const BUTTON_LABEL = {
  idle: "Calculate impact",
  loading: "Calculating…",
  done: "Recalculate",
  stale: "Recalculate",
} as const;

export function ClimateImpact({ rows, state, onChange }: Props) {
  const validCount = rows.reduce((c, r) => c + (isValidRow(r) ? 1 : 0), 0);
  const ready = validCount > 0;
  const isStale =
    state.state === "done" && validCount !== state.calculatedFromCount;
  const visualState = isStale ? "stale" : state.state;

  const calculate = async () => {
    if (!ready || state.state === "loading") return;
    onChange({ ...state, state: "loading" });
    const kg = await calculateClimate(rows);
    onChange({ state: "done", kg, calculatedFromCount: validCount });
  };

  const tone = toneFor(state.kg);
  const { kg } = state;

  return (
    <div
      className="flex flex-col"
      style={{
        padding: 14,
        borderRadius: 10,
        background: "rgb(45 74 62 / 0.04)",
        border: "1px solid rgb(45 74 62 / 0.08)",
        gap: 12,
      }}
    >
      {kg == null ? (
        <div
          className="text-ink-muted text-center italic"
          style={{ fontSize: 13, padding: "14px 4px" }}
        >
          Not yet calculated
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap items-baseline" style={{ gap: 6 }}>
            <span
              className="font-serif"
              style={{
                fontSize: 32,
                color: tone.color,
                letterSpacing: -0.5,
                lineHeight: 1,
              }}
            >
              {kg.toFixed(1)}
            </span>
            <span className="text-ink-muted" style={{ fontSize: 13 }}>
              kg CO₂e / portion
            </span>
          </div>
          <div
            className="inline-block font-semibold uppercase"
            style={{
              marginTop: 8,
              fontSize: 10,
              letterSpacing: 0.4,
              padding: "3px 8px",
              borderRadius: 4,
              color: tone.color,
              background: tone.bg,
            }}
          >
            {tone.label}
          </div>
        </div>
      )}

      {visualState === "stale" && (
        <div
          className="text-amber font-medium"
          style={{
            fontSize: 11,
            padding: "6px 10px",
            borderRadius: 6,
            background: "rgb(196 128 58 / 0.1)",
            border: "1px solid rgb(196 128 58 / 0.2)",
          }}
        >
          Ingredients changed — recalculate to refresh.
        </div>
      )}

      <Button
        type="button"
        onClick={calculate}
        disabled={!ready || visualState === "loading"}
        primary={visualState !== "done"}
        style={{ whiteSpace: "nowrap", justifyContent: "center" }}
      >
        {BUTTON_LABEL[visualState]}
      </Button>
    </div>
  );
}
