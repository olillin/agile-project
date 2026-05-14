"use server";

import type { Ingredient, Lunch } from "@/generated/prisma/client";
import type { ServingGetPayload } from "@/generated/prisma/models";
import {
  formatFeedDayLabel,
  getFeedDateKey,
  isFeedDateToday,
} from "@/lib/dateFormat";
import { prisma } from "@/lib/prisma";
import type { ClimateLabel, Day, DietTag, MealLine } from "@/lib/types";
import { getEcoScore } from "./sustainabilityService";

const DEFAULT_FEED_LOOKBACK_DAYS = 14;
const DEFAULT_FEED_DAYS_PAGE_SIZE = 10;

export type FeedDaysPage = {
  days: Day[];
  nextCursor: string | null;
};

export type NewIngredient = Omit<Ingredient, "id" | "lunchId">;

type ServingWithLunch = ServingGetPayload<{
  include: { lunch: { include: { ingredients: true } } };
}>;

type LunchIdentifier = { id: number } | { name: string };

type LunchDetailsInput = {
  name?: string;
  line?: MealLine;
  description?: string;
};

type AddLunchDetailsInput = {
  line: MealLine;
  description?: string;
};

const MEAL_LINES: MealLine[] = ["Vegetarian", "Nordic", "Street food"];

const LINE_STYLE: Record<MealLine, { color: string; pattern: number }> = {
  Vegetarian: { color: "#8FA67A", pattern: 45 },
  Nordic: { color: "#6E91A8", pattern: 90 },
  "Street food": { color: "#E4A866", pattern: 20 },
};

const FISH_INGREDIENTS = ["fish", "cod", "salmon", "tuna", "herring"];
const MEAT_INGREDIENTS = [
  "beef",
  "chicken",
  "meat",
  "pork",
  "turkey",
  "bacon",
  "ham",
];
const ANIMAL_PRODUCT_INGREDIENTS = [
  ...FISH_INGREDIENTS,
  ...MEAT_INGREDIENTS,
  "butter",
  "cheese",
  "cream",
  "egg",
  "milk",
  "ricotta",
  "yogurt",
];

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function getDateSpan(startDate: Date | string, endDate: Date | string) {
  const startKey = getFeedDateKey(startDate);
  const endKey = getFeedDateKey(endDate);

  if (startKey > endKey) {
    throw new Error("startDate must be before or equal to endDate");
  }

  return {
    startKey,
    endKey,
    start: new Date(`${startKey}T00:00:00.000Z`),
    endExclusive: addDays(new Date(`${endKey}T00:00:00.000Z`), 1),
  };
}

function getDefaultDateSpan() {
  const today = new Date();
  return getDateSpan(addDays(today, -DEFAULT_FEED_LOOKBACK_DAYS), today);
}

function isDateKeyInSpan(dateKey: string, startKey: string, endKey: string) {
  return dateKey >= startKey && dateKey <= endKey;
}

function getLunchName(name: string): string {
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    throw new Error("Lunch name cannot be empty");
  }

  return trimmedName;
}

function getLunchIdentifier(nameOrId: number | string): LunchIdentifier {
  if (typeof nameOrId === "number") {
    if (!Number.isInteger(nameOrId) || nameOrId <= 0) {
      throw new Error("Lunch id must be a positive integer");
    }

    return { id: nameOrId };
  }

  return { name: getLunchName(nameOrId) };
}

function getLunchDetailsData(details: LunchDetailsInput) {
  const data: LunchDetailsInput = {};

  if (details.name !== undefined) {
    data.name = getLunchName(details.name);
  }

  if (details.line !== undefined) {
    data.line = details.line;
  }

  if (details.description !== undefined) {
    data.description = details.description.trim();
  }

  return data;
}

function getIngredientData(ingredients: NewIngredient[]) {
  return ingredients.map(ingredient => {
    const name = ingredient.name.trim();
    const unit = ingredient.unit.trim();

    if (name.length === 0) {
      throw new Error("Ingredient name cannot be empty");
    }

    if (unit.length === 0) {
      throw new Error("Ingredient unit cannot be empty");
    }

    if (!Number.isFinite(ingredient.amount) || ingredient.amount < 0) {
      throw new Error("Ingredient amount must be a non-negative number");
    }

    return {
      name,
      unit,
      amount: ingredient.amount,
    };
  });
}

function hasIngredient(ingredients: Ingredient[], names: string[]): boolean {
  return ingredients.some(ingredient => {
    const ingredientName = ingredient.name.toLowerCase();
    return names.some(name => ingredientName.includes(name));
  });
}

function getDietTags(ingredients: Ingredient[]): DietTag[] {
  const hasFish = hasIngredient(ingredients, FISH_INGREDIENTS);
  const hasMeat = hasIngredient(ingredients, MEAT_INGREDIENTS);
  const hasAnimalProduct = hasIngredient(
    ingredients,
    ANIMAL_PRODUCT_INGREDIENTS
  );
  const tags: DietTag[] = [];

  if (hasFish) tags.push("fish");
  if (hasMeat) tags.push("meat");
  if (!hasFish && !hasMeat) tags.push("vegetarian");
  if (!hasAnimalProduct) tags.push("vegan");

  return tags;
}

function getClimateLabel(climate: number): ClimateLabel {
  if (climate <= 1) return "low";
  if (climate <= 2) return "medium";
  return "high";
}

function getMealLine(line: string): MealLine {
  if (MEAL_LINES.includes(line as MealLine)) return line as MealLine;
  return "Street food";
}

function getDescription(lunch: ServingWithLunch["lunch"]): string {
  const description = lunch.description.trim();
  if (description.length > 0) return description;

  const ingredientNames = lunch.ingredients.map(ingredient => ingredient.name);
  if (ingredientNames.length === 0) return "";
  return `Made with ${ingredientNames.join(", ")}.`;
}

function toDayOption(serving: ServingWithLunch): Day["options"][number] {
  const line = getMealLine(serving.lunch.line);
  const style = LINE_STYLE[line];
  const climate = serving.lunch.ecoScore;

  return {
    id: serving.id.toString(),
    line,
    name: serving.lunch.name,
    color: style.color,
    pattern: style.pattern,
    tags: getDietTags(serving.lunch.ingredients),
    climate,
    climateLabel: getClimateLabel(climate),
    desc: getDescription(serving.lunch),
  };
}

function groupServingsByDay(
  servings: ServingWithLunch[],
  includeDateKey: (dateKey: string) => boolean
): Map<string, ServingWithLunch[]> {
  const dayMap = new Map<string, ServingWithLunch[]>();

  servings.forEach(serving => {
    const dayKey = getFeedDateKey(serving.date);
    if (!includeDateKey(dayKey)) return;

    const ls = dayMap.get(dayKey);
    if (ls == undefined) {
      dayMap.set(dayKey, [serving]);
    } else {
      ls.push(serving);
      dayMap.set(dayKey, ls);
    }
  });

  return dayMap;
}

function buildDays(
  dayMap: Map<string, ServingWithLunch[]>,
  dateKeys?: string[]
): Day[] {
  const orderedDateKeys =
    dateKeys ?? [...dayMap.keys()].sort((a, b) => b.localeCompare(a));

  return orderedDateKeys.flatMap(date => {
    const options = dayMap.get(date);
    if (!options || options.length === 0) return [];

    return [
      {
        id: date,
        label: formatFeedDayLabel(date),
        date,
        isToday: isFeedDateToday(date),
        options: options.map(toDayOption),
      },
    ];
  });
}

export async function getAll() {
  return await prisma.lunch.findMany();
}

export async function getLunchById(id: number): Promise<Lunch | null> {
  return prisma.lunch.findUnique({
    where: { id },
  });
}

export async function getLunchByName(name: string): Promise<Lunch | null> {
  return prisma.lunch.findUnique({
    where: { name },
  });
}

/**
 * Looks up one lunch by numeric id or by exact lunch name.
 */
export async function getLunch(
  identifier: number | string
): Promise<Lunch | null> {
  return typeof identifier === "number"
    ? getLunchById(identifier)
    : getLunchByName(identifier);
}

export async function getLunchesServedOn(
  date: Date | string
): Promise<Lunch[]> {
  return getLunchesByDateSpan(date, date);
}

export async function getLunchesByDateSpan(
  startDate: Date | string,
  endDate: Date | string
): Promise<Lunch[]> {
  const { start, endExclusive } = getDateSpan(startDate, endDate);

  return prisma.lunch.findMany({
    where: {
      servings: {
        some: {
          date: {
            gte: start,
            lt: endExclusive,
          },
        },
      },
    },
  });
}

async function getServingsByDateSpan(
  startDate: Date | string,
  endDate: Date | string
): Promise<ServingWithLunch[]> {
  const { start, endExclusive } = getDateSpan(startDate, endDate);

  return prisma.serving.findMany({
    where: {
      date: {
        gte: start,
        lt: endExclusive,
      },
    },
    include: {
      lunch: {
        include: {
          ingredients: true,
        },
      },
    },
    orderBy: [{ date: "desc" }, { lunchId: "asc" }],
  });
}

async function getLatestServingDayKeys(
  limit: number,
  beforeDate?: Date | string
): Promise<string[]> {
  const beforeKey = getFeedDateKey(beforeDate ?? addDays(new Date(), 1));
  const rows = await prisma.serving.groupBy({
    by: ["date"],
    where: {
      date: {
        lt: new Date(`${beforeKey}T00:00:00.000Z`),
      },
    },
    orderBy: {
      date: "desc",
    },
    take: limit,
  });

  return rows.map(row => getFeedDateKey(row.date));
}

export async function getFeedDaysPage({
  beforeDate,
  limit = DEFAULT_FEED_DAYS_PAGE_SIZE,
}: {
  beforeDate?: Date | string;
  limit?: number;
} = {}): Promise<FeedDaysPage> {
  const pageSize = Math.max(1, Math.floor(limit));
  const dateKeys = await getLatestServingDayKeys(pageSize + 1, beforeDate);
  const visibleDateKeys = dateKeys.slice(0, pageSize);

  if (visibleDateKeys.length === 0) {
    return { days: [], nextCursor: null };
  }

  const newestDate = visibleDateKeys[0];
  const oldestDate = visibleDateKeys[visibleDateKeys.length - 1];
  const servings = await getServingsByDateSpan(oldestDate, newestDate);
  const visibleDateKeySet = new Set(visibleDateKeys);
  const dayMap = groupServingsByDay(servings, dayKey =>
    visibleDateKeySet.has(dayKey)
  );

  return {
    days: buildDays(dayMap, visibleDateKeys),
    nextCursor: dateKeys.length > pageSize ? oldestDate : null,
  };
}

export async function addLunch(
  name: string,
  ingredients: NewIngredient[],
  { line, description = "" }: AddLunchDetailsInput
) {
  const ingredientData = getIngredientData(ingredients);
  const ecoScore = await getEcoScore(ingredientData);

  const lunch = await prisma.lunch.create({
    data: {
      name: getLunchName(name),
      line,
      description: description.trim(),
      ecoScore: ecoScore,
      ingredients: {
        create: ingredientData,
      },
    },
  });
  return lunch;
}

export async function getDays(
  startDate?: Date | string,
  endDate?: Date | string
): Promise<Day[]> {
  const { startKey, endKey } =
    startDate && endDate
      ? getDateSpan(startDate, endDate)
      : getDefaultDateSpan();
  const servings = await getServingsByDateSpan(startKey, endKey);
  const groupedDayMap = groupServingsByDay(servings, dayKey =>
    isDateKeyInSpan(dayKey, startKey, endKey)
  );

  return buildDays(groupedDayMap);
}

export async function removeLunch(nameOrId: number | string) {
  return prisma.lunch.delete({
    where: getLunchIdentifier(nameOrId),
  });
}

export async function updateLunch(
  nameOrId: number | string,
  ingredients: NewIngredient[],
  details: LunchDetailsInput = {}
) {
  const where = getLunchIdentifier(nameOrId);
  const lunchData = getLunchDetailsData(details);
  const ingredientData = getIngredientData(ingredients);

  return prisma.lunch.update({
    where,
    data: {
      ...lunchData,
      ingredients: {
        deleteMany: {},
        create: ingredientData,
      },
      ecoScore: await getEcoScore(ingredientData),
    },
  });
}
