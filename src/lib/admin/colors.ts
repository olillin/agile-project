import type { PillTone } from "@/components/admin/Pill";
import type { MealLine } from "@/lib/types";
import type { ClimateBucket } from "./types";

export const MEAL_LINES: readonly MealLine[] = [
  "Nordic",
  "Vegetarian",
  "Street food",
] as const;

export const LINE_COLOR: Record<MealLine, string> = {
  Nordic: "var(--color-tea)",
  Vegetarian: "var(--color-sage)",
  "Street food": "var(--color-amber)",
};

export const DIST_COLORS: readonly string[] = [
  "var(--color-rose)",
  "var(--color-rose)",
  "var(--color-amber)",
  "var(--color-sage)",
  "var(--color-sage)",
];

export function ratingColor(r: number): string {
  if (r >= 4) return DIST_COLORS[4];
  if (r >= 3) return DIST_COLORS[2];
  return DIST_COLORS[1];
}

export function climateTone(c: ClimateBucket): PillTone | null {
  if (c === "low") return "good";
  if (c === "med") return "warn";
  if (c === "high") return "bad";
  return null;
}

export function kgToBucket(kg: number | null): ClimateBucket {
  if (kg == null) return null;
  if (kg <= 1.0) return "low";
  if (kg <= 2.0) return "med";
  return "high";
}

export const BUCKET_COLOR: Record<NonNullable<ClimateBucket>, string> = {
  low: "var(--color-sage)",
  med: "var(--color-amber)",
  high: "var(--color-rose)",
};
