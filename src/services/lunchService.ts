"use server";

import { Prisma } from "@/generated/prisma/client";
import type { Ingredient, Lunch } from "@/generated/prisma/client";
import type { ServingGetPayload } from "@/generated/prisma/models";
import {
  INGREDIENT_UNITS,
  IngredientRow,
  IngredientUnit,
} from "@/lib/admin/types";
import {
  formatFeedDayLabel,
  getFeedDateKey,
  isFeedDateToday,
} from "@/lib/dateFormat";
import { prisma } from "@/lib/prisma";
import type { ClimateLabel, Day, DietTag, MealLine } from "@/lib/types";
import { revalidatePath } from "next/cache";
import {
  CannotUnschedulePastServingError,
  InvalidServingDateError,
  LunchNotFoundError,
  ServingAlreadyScheduledError,
  ServingNotFoundError,
} from "./lunchErrors";
import { getEcoScore } from "./sustainabilityService";

export type LunchWithAll = Prisma.LunchGetPayload<{
  include: {
    servings: {
      include: {
        reviews: true;
      };
    };
    ingredients: true;
  };
}>;

const DEFAULT_FEED_LOOKBACK_DAYS = 14;
const DEFAULT_FEED_DAYS_PAGE_SIZE = 10;

export type FeedDaysPage = {
  days: Day[];
  nextCursor: string | null;
};

export type NewIngredient = Omit<IngredientRow, "id">;

type ServingWithLunch = ServingGetPayload<{
  include: { lunch: { include: { ingredients: true } } };
}>;

type LunchIdentifier = { id: number } | { name: string };

type LunchDetailsInput = {
  name?: string;
  line?: MealLine;
  description?: string;
  tags?: string[];
};

type AddLunchDetailsInput = {
  tags: string[];
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

  if (details.tags !== undefined) {
    data.tags = details.tags;
  }

  return data;
}

function isUnit(maybeUnit: unknown): maybeUnit is IngredientUnit {
  if (typeof maybeUnit !== "string") {
    return false;
  }
  return (INGREDIENT_UNITS as readonly string[]).includes(maybeUnit);
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

    if (!isUnit(unit)) {
      throw new Error("Unit must be one of the followng: g, kg, ml, dl, l, st");
    }

    return {
      name,
      unit: unit as IngredientUnit,
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

export async function getLunchById(id: number): Promise<LunchWithAll | null> {
  return prisma.lunch.findUnique({
    where: { id },
    include: {
      servings: {
        include: {
          reviews: true,
        },
      },
      ingredients: true,
    },
  });
}

export async function getLunchByName(
  name: string
): Promise<LunchWithAll | null> {
  return prisma.lunch.findUnique({
    where: { name },
    include: {
      servings: {
        include: {
          reviews: true,
        },
      },
      ingredients: true,
    },
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
  { line, tags, description = "" }: AddLunchDetailsInput
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
      tags,
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

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Schedules a meal to be served on a given date.
 * `date` must be a `YYYY-MM-DD` string strictly in the future (tomorrow or later).
 * Throws `ServingAlreadyScheduledError` if the lunch is already scheduled
 * on that date.
 */
export async function scheduleServing(lunchId: number, date: string) {
  if (!Number.isInteger(lunchId) || lunchId <= 0) {
    throw new Error("Lunch id must be a positive integer");
  }

  if (!DATE_KEY_PATTERN.test(date)) {
    throw new InvalidServingDateError("Date must be in YYYY-MM-DD format");
  }

  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new InvalidServingDateError(`Invalid date: ${date}`);
  }
  // Reject out-of-range days (e.g. 2026-02-30 → 2026-03-02).
  if (getFeedDateKey(parsed) !== date) {
    throw new InvalidServingDateError(`Invalid date: ${date}`);
  }

  const todayKey = getFeedDateKey(new Date());
  if (date <= todayKey) {
    throw new InvalidServingDateError("Pick a future date");
  }

  try {
    const serving = await prisma.serving.create({
      data: {
        lunchId,
        date: parsed,
      },
    });
    revalidatePath(`/admin/meals/${lunchId}`);
    return serving;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw new ServingAlreadyScheduledError(
          "This meal is already scheduled on that date"
        );
      }
      if (e.code === "P2003") {
        throw new LunchNotFoundError(`Lunch ${lunchId} does not exist`);
      }
    }
    throw e;
  }
}

/**
 * Removes a scheduled serving by id. Only future servings can be
 * removed — past servings carry reviews that would cascade-delete via
 * the schema's `onDelete: Cascade`, so we reject those server-side
 * regardless of what the UI exposes.
 */
export async function unscheduleServing(servingId: number) {
  if (!Number.isInteger(servingId) || servingId <= 0) {
    throw new Error("Serving id must be a positive integer");
  }

  const serving = await prisma.serving.findUnique({
    where: { id: servingId },
    select: { date: true, lunchId: true },
  });

  if (!serving) {
    throw new ServingNotFoundError(`Serving ${servingId} does not exist`);
  }

  const todayKey = getFeedDateKey(new Date());
  if (getFeedDateKey(serving.date) <= todayKey) {
    throw new CannotUnschedulePastServingError(
      "Past servings can't be unscheduled"
    );
  }

  await prisma.serving.delete({
    where: { id: servingId },
  });
  revalidatePath(`/admin/meals/${serving.lunchId}`);
}
