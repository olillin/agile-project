// TODO: In-memory stub. Swap for real backend calls when the API lands.

import { kgToBucket } from "@/lib/admin/colors";
import { MEALS } from "@/lib/admin/fixtures";
import {
  DIET_TAG_SET,
  isValidRow,
  NEW_TAG,
  parseAmount,
  type Ingredient,
  type IngredientRow,
  type MealStat,
  type PhotoRef,
} from "@/lib/admin/types";
import type { DietTag, MealLine } from "@/lib/types";

export type MealInput = {
  name: string;
  line: MealLine;
  tags: DietTag[];
  ingredients: IngredientRow[];
  photo: PhotoRef | null;
  co2: number | null;
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

function parseIngredients(rows: IngredientRow[]): Ingredient[] {
  return rows.filter(isValidRow).map(r => {
    const amount = parseAmount(r.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error(`Invalid amount for "${r.name}": ${r.amount}`);
    }
    return { name: r.name.trim(), amount, unit: r.unit };
  });
}

export async function calculateClimate(rows: IngredientRow[]): Promise<number> {
  await wait(FAKE_LATENCY_MS);
  const validCount = rows.filter(isValidRow).length;
  const base = 0.25 + validCount * 0.35;
  const jitter = (Math.random() - 0.5) * 0.2;
  return Math.max(0.1, Math.round((base + jitter) * 10) / 10);
}

export async function createMeal(input: MealInput): Promise<MealStat> {
  await wait(FAKE_LATENCY_MS / 2);
  const meal: MealStat = {
    id: uniqueId(slugify(input.name)),
    name: input.name.trim(),
    line: input.line,
    tags: [...input.tags, NEW_TAG],
    rating: null,
    votes: 0,
    distribution: [0, 0, 0, 0, 0],
    co2: input.co2,
    climate: kgToBucket(input.co2),
    lastServed: "never",
    ingredients: parseIngredients(input.ingredients),
    photo: input.photo ?? undefined,
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
  // Form only manages diet tags; preserve cuisine/shape tags and NEW_TAG.
  const preserved = existing.tags.filter(t => !DIET_TAG_SET.has(t));
  const updated: MealStat = {
    ...existing,
    name: patch.name.trim(),
    line: patch.line,
    tags: [...patch.tags, ...preserved],
    ingredients: parseIngredients(patch.ingredients),
    photo: patch.photo ?? undefined,
    co2,
    climate: kgToBucket(co2),
  };
  MEALS[i] = updated;
  return updated;
}

export async function deleteMeal(id: string): Promise<void> {
  await wait(FAKE_LATENCY_MS / 2);
  MEALS.splice(requireIndex(id), 1);
}
