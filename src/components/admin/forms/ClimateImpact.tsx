"use client";

import { Pill } from "@/components/admin/Pill";
import { Button } from "@/components/ui/Button";
import { BUCKET_COLOR, climateTone, kgToBucket } from "@/lib/admin/colors";
import {
  isValidRow,
  type ClimateBucket,
  type ClimateFormState,
  type IngredientRow,
} from "@/lib/admin/types";
import { getEcoScore } from "@/services/sustainabilityService";

type Props = {
  rows: IngredientRow[];
  state: ClimateFormState;
  onChange: (next: ClimateFormState) => void;
};

type VisualState = ClimateFormState["state"] | "stale";

const IMPACT_LABEL: Record<NonNullable<ClimateBucket>, string> = {
  low: "low impact",
  med: "moderate",
  high: "higher impact",
};

const BUTTON_LABEL: Record<VisualState, string> = {
  idle: "Calculate impact",
  loading: "Calculating…",
  done: "Recalculate",
  stale: "Recalculate",
};

export function ClimateImpact({ rows, state, onChange }: Props) {
  const validCount = rows.filter(isValidRow).length;
  const ready = validCount > 0;
  const isStale =
    state.state === "done" && validCount !== state.calculatedFromCount;
  const visualState: VisualState = isStale ? "stale" : state.state;

  const calculate = async () => {
    const validRows = rows.filter(isValidRow);
    console.log(validRows)
    if (validRows.length === 0 || state.state === "loading") return;
    onChange({ ...state, state: "loading" });
    try {
      const kg = await getEcoScore(validRows);
      console.log(kg);

      onChange({ state: "done", kg, calculatedFromCount: validRows.length });
    } catch {
      onChange({ ...state, state: "idle" });
    }
  };

  const { kg } = state;
  const bucket = kgToBucket(kg);
  const numberColor = bucket ? BUCKET_COLOR[bucket] : "var(--color-ink-muted)";
  const pillTone = bucket ? climateTone(bucket) : null;

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
                color: numberColor,
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
          {bucket && pillTone && (
            <div style={{ marginTop: 8 }}>
              <Pill tone={pillTone} shape="square" size="sm">
                {IMPACT_LABEL[bucket]}
              </Pill>
            </div>
          )}
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
