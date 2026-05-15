import type { DietTag, MealLine } from "@/lib/types";

export const NEW_TAG = "new";

export type ClimateBucket = "low" | "med" | "high" | null;

export const INGREDIENT_UNITS = ["g", "kg", "ml", "dl", "l", "st"] as const;
export type IngredientUnit = (typeof INGREDIENT_UNITS)[number];

export const DEFAULT_LINE: MealLine = "Vegetarian";

export const parseAmount = (s: string | number): number =>
  Number(s.toString().replace(",", "."));

export type Ingredient = IngredientRow;

// TODO: storage pipeline. Picked Files are captured locally and only
// `filename` is set. `url` is populated once a real upload lands.
export type PhotoRef = {
  filename: string;
  url?: string;
};

export type MealStat = {
  id: number;
  name: string;
  line: MealLine;
  tags: string[];
  rating: number | null;
  votes: number;
  distribution: [number, number, number, number, number];
  co2: number | null;
  climate: ClimateBucket;
  lastServed: string;
  firstServed?: string;
  firstServedAt?: string | null;
  lastServedAt?: string | null;
  timesServed?: number;
  ingredients: Ingredient[];
  photo?: PhotoRef;
};

export type IngredientRow = {
  id: number;
  name: string;
  amount: number;
  unit: IngredientUnit;
};

// A row counts as filled when both fields have content. Climate calculation
// and persistence skip rows where either is blank.
export const isValidRow = (r: IngredientRow): boolean =>
  r.name.trim().length > 0 && r.amount > 0;

// Fresh row for editor / page initial state. The id is only used as a
// React key, never persisted, so server/client divergence is harmless.
export const newIngredientRow = (): IngredientRow => ({
  id: 0,
  name: "",
  amount: 0,
  unit: "g",
});

export type ClimateFormState = {
  state: "idle" | "loading" | "done";
  kg: number | null;
  calculatedFromCount: number;
};

export type MealForm = {
  name: string;
  line: MealLine;
  tags: DietTag[];
  ingredients: IngredientRow[];
  photo: PhotoRef | null;
  climate: ClimateFormState;
};

export const TAG_OPTIONS = [
  "vegetarian",
  "vegan",
  "fish",
  "meat",
  "gluten-free",
] as const satisfies readonly DietTag[];

export const DIET_TAG_SET: ReadonlySet<string> = new Set(TAG_OPTIONS);

// Comments are intentionally anonymous
export type MealComment = {
  id: number;
  mealId: number;
  mealName: string;
  rating: number;
  text: string;
  when: string;
  postedAt?: string;
  tags: string[];
};

export type TrendSeries = {
  name: string;
  color: string;
  data: number[];
};

export type TrendFootnote = {
  label: string;
  value: string;
  sub: string;
  tone: string;
};

export type TagBarItem = {
  label: string;
  count: number;
  color?: string;
};

export type Kpi = {
  label: string;
  value: string;
  trend: string;
  sub: string;
  spark: number[];
  color: string;
};
