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
  if (r >= 4) return "var(--color-sage)";
  if (r >= 3) return "var(--color-amber)";
  return "var(--color-rose)";
}

export function climateTone(c: ClimateBucket): "good" | "warn" | "bad" | null {
  if (c === "low") return "good";
  if (c === "med") return "warn";
  if (c === "high") return "bad";
  return null;
}
