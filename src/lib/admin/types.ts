import type { DietTag, MealLine } from "@/lib/types";

export const NEW_TAG = "new";

export type ClimateBucket = "low" | "med" | "high" | null;

export const INGREDIENT_UNITS = ["g", "kg", "ml", "dl", "l", "st"] as const;
export type IngredientUnit = (typeof INGREDIENT_UNITS)[number];

export type Ingredient = {
  id?: string;
  name: string;
  amount: number;
  unit: IngredientUnit;
};

export type PhotoRef = {
  url?: string;
  filename?: string;
};

export type MealStat = {
  id: string;
  name: string;
  line: MealLine;
  tags: string[];
  rating: number | null;
  votes: number;
  distribution: [number, number, number, number, number];
  co2: number;
  climate: ClimateBucket;
  lastServed: string;
  ingredients: Ingredient[];
  photo?: PhotoRef;
};

export type IngredientRow = {
  name: string;
  amount: string;
  unit: IngredientUnit;
};

export type ClimateFormState = {
  state: "idle" | "loading" | "done" | "stale";
  kg: number | null;
  calculatedFromCount: number;
};

export type MealForm = {
  name: string;
  line: MealLine;
  tags: string[];
  ingredients: IngredientRow[];
  photo: PhotoRef & { file?: File };
  climate: ClimateFormState;
};

export const TAG_OPTIONS = [
  "vegetarian",
  "vegan",
  "fish",
  "meat",
  "gluten-free",
] as const satisfies readonly DietTag[];

// Comments are intentionally anonymous
export type MealComment = {
  id: number;
  mealId: string;
  mealName: string;
  rating: number;
  text: string;
  when: string;
  tags: string[];
};

export type TrendSeries = {
  name: string;
  color: string;
  data: number[];
};

export type Kpi = {
  label: string;
  value: string;
  trend: string;
  sub: string;
  spark: number[];
  color: string;
};
