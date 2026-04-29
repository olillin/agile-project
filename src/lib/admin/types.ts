import type { MealLine } from "@/lib/types";

export const NEW_TAG = "new";

export type ClimateBucket = "low" | "med" | "high" | null;

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
};

// Comments are intentionally anonymous — no studentId, no fingerprint, no
// device ID. Privacy-driven product decision; do not add identifiers here
// without a sign-off from product/legal.
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
