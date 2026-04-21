export type ClimateLabel = "low" | "medium" | "high";

export type MealLine = "Vegetarian" | "Nordic" | "Street food";

export type DietTag =
  | "vegetarian"
  | "vegan"
  | "fish"
  | "meat"
  | "gluten-free";

export type Option = {
  id: string;
  line: MealLine;
  name: string;
  color: string;
  pattern: number;
  tags: DietTag[];
  climate: number;
  climateLabel: ClimateLabel;
  desc: string;
};

export type Day = {
  id: string;
  label: string;
  date: string;
  isToday: boolean;
  options: Option[];
};

export type RatingPayload = {
  optionId: string;
  dayId: string;
  rating: number;
  tags: string[];
  note: string;
};
