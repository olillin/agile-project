// NOTE: In-memory stub. Swap for real backend calls when the API lands.

import { MEALS } from "@/lib/admin/fixtures";
import {
  NEW_TAG,
  type ClimateBucket,
  type Ingredient,
  type IngredientRow,
  type MealStat,
  type PhotoRef,
} from "@/lib/admin/types";
import type { MealLine } from "@/lib/types";

export type MealInput = {
  name: string;
  line: MealLine;
  tags: string[];
  ingredients: IngredientRow[];
  photo?: PhotoRef;
  co2?: number;
};

const FAKE_LATENCY_MS = 700;

const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "meal"
  );
}

function uniqueId(base: string): string {
  if (!MEALS.some(m => m.id === base)) return base;
  let n = 2;
  while (MEALS.some(m => m.id === `${base}-${n}`)) n++;
  return `${base}-${n}`;
}

function requireIndex(id: string): number {
  const i = MEALS.findIndex(m => m.id === id);
  if (i === -1) throw new Error(`Meal not found: ${id}`);
  return i;
}

function isValidRow(r: IngredientRow): boolean {
  return r.name.trim().length > 0 && r.amount.trim().length > 0;
}

function parseIngredients(rows: IngredientRow[]): Ingredient[] {
  return rows.filter(isValidRow).map(r => ({
    name: r.name.trim(),
    amount: Number(r.amount.replace(",", ".")),
    unit: r.unit,
  }));
}

function climateBucket(kg: number): ClimateBucket {
  if (kg <= 1.0) return "low";
  if (kg <= 2.0) return "med";
  return "high";
}

export async function calculateClimate(rows: IngredientRow[]): Promise<number> {
  await wait(FAKE_LATENCY_MS);
  const validCount = rows.reduce((c, r) => c + (isValidRow(r) ? 1 : 0), 0);
  const base = 0.25 + validCount * 0.35;
  const jitter = (Math.random() - 0.5) * 0.2;
  return Math.max(0.1, Math.round((base + jitter) * 10) / 10);
}

export async function createMeal(input: MealInput): Promise<MealStat> {
  await wait(FAKE_LATENCY_MS / 2);
  const co2 = input.co2 ?? 0;
  const meal: MealStat = {
    id: uniqueId(slugify(input.name)),
    name: input.name.trim(),
    line: input.line,
    tags: [...input.tags, NEW_TAG],
    rating: null,
    votes: 0,
    distribution: [0, 0, 0, 0, 0],
    co2,
    climate: input.co2 != null ? climateBucket(co2) : null,
    lastServed: "never",
    ingredients: parseIngredients(input.ingredients),
    photo: input.photo,
  };
  MEALS.push(meal);
  return meal;
}

export async function updateMeal(
  id: string,
  patch: MealInput
): Promise<MealStat> {
  await wait(FAKE_LATENCY_MS / 2);
  const i = requireIndex(id);
  const existing = MEALS[i];
  const co2 = patch.co2 ?? existing.co2;
  const updated: MealStat = {
    ...existing,
    name: patch.name.trim(),
    line: patch.line,
    tags: patch.tags,
    ingredients: parseIngredients(patch.ingredients),
    photo: patch.photo,
    co2,
    climate: patch.co2 != null ? climateBucket(co2) : existing.climate,
  };
  MEALS[i] = updated;
  return updated;
}

export async function deleteMeal(id: string): Promise<void> {
  await wait(FAKE_LATENCY_MS / 2);
  MEALS.splice(requireIndex(id), 1);
}
