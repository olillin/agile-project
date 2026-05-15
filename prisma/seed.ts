import "dotenv/config";
import { SuggestionCreateInput } from "@/generated/prisma/models";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

type MealLine = "Nordic" | "Vegetarian" | "Street food";

type IngredientSeed = { name: string; amount: number; unit: string };

type LunchSeed = {
  name: string;
  line: MealLine;
  description: string;
  ecoScore: number;
  ingredients: IngredientSeed[];
  // Mean rating this meal tends to receive; reviews are sampled around this.
  ratingBias: number;
};

const LINES = [
  "Nordic",
  "Vegetarian",
  "Street food",
] as const satisfies readonly MealLine[];

const LUNCHES: LunchSeed[] = [
  // ── Nordic ────────────────────────────────────────────────────────────
  {
    name: "Swedish meatballs",
    line: "Nordic",
    description: "Classic Swedish meatballs, cream sauce, lingonberry, mash.",
    ecoScore: 2.4,
    ingredients: [
      { name: "Beef", amount: 80, unit: "g" },
      { name: "Pork", amount: 40, unit: "g" },
      { name: "Potatoes", amount: 200, unit: "g" },
      { name: "Cream", amount: 80, unit: "ml" },
    ],
    ratingBias: 4.4,
  },
  {
    name: "Pyttipanna",
    line: "Nordic",
    description: "Diced potatoes, onion and beef pan-fried with a fried egg.",
    ecoScore: 2.1,
    ingredients: [
      { name: "Beef", amount: 70, unit: "g" },
      { name: "Potatoes", amount: 250, unit: "g" },
      { name: "Egg", amount: 1, unit: "st" },
    ],
    ratingBias: 3.6,
  },
  {
    name: "Salmon with dill potatoes",
    line: "Nordic",
    description: "Oven-baked salmon, dill potatoes and lemon-butter sauce.",
    ecoScore: 1.4,
    ingredients: [
      { name: "Salmon", amount: 150, unit: "g" },
      { name: "Potatoes", amount: 200, unit: "g" },
      { name: "Butter", amount: 20, unit: "g" },
    ],
    ratingBias: 4.2,
  },
  {
    name: "Cod in creamy sauce",
    line: "Nordic",
    description: "Poached cod fillet in a creamy leek and chive sauce.",
    ecoScore: 1.3,
    ingredients: [
      { name: "Cod", amount: 160, unit: "g" },
      { name: "Cream", amount: 100, unit: "ml" },
      { name: "Leek", amount: 60, unit: "g" },
    ],
    ratingBias: 3.8,
  },
  {
    name: "Pea soup and pancakes",
    line: "Nordic",
    description: "Yellow pea soup served with thin pancakes and jam.",
    ecoScore: 0.8,
    ingredients: [
      { name: "Peas", amount: 180, unit: "g" },
      { name: "Egg", amount: 1, unit: "st" },
      { name: "Milk", amount: 100, unit: "ml" },
    ],
    ratingBias: 3.4,
  },
  {
    name: "Janssons frestelse",
    line: "Nordic",
    description: "Potato gratin with sprats, onion and cream.",
    ecoScore: 1.6,
    ingredients: [
      { name: "Potatoes", amount: 220, unit: "g" },
      { name: "Herring", amount: 60, unit: "g" },
      { name: "Cream", amount: 120, unit: "ml" },
    ],
    ratingBias: 3.5,
  },
  {
    name: "Pork chops with apple sauce",
    line: "Nordic",
    description: "Pan-fried pork chops, mash and chunky apple sauce.",
    ecoScore: 2.1,
    ingredients: [
      { name: "Pork", amount: 180, unit: "g" },
      { name: "Potatoes", amount: 200, unit: "g" },
      { name: "Apple", amount: 80, unit: "g" },
    ],
    ratingBias: 3.9,
  },
  {
    name: "Chicken and root vegetable stew",
    line: "Nordic",
    description: "Slow-cooked chicken thigh with carrots, parsnips and thyme.",
    ecoScore: 1.8,
    ingredients: [
      { name: "Chicken", amount: 160, unit: "g" },
      { name: "Carrots", amount: 120, unit: "g" },
      { name: "Parsnip", amount: 80, unit: "g" },
    ],
    ratingBias: 4.0,
  },
  {
    name: "Beef stroganoff",
    line: "Nordic",
    description: "Beef strips in a sour cream and mustard sauce over rice.",
    ecoScore: 2.6,
    ingredients: [
      { name: "Beef", amount: 150, unit: "g" },
      { name: "Cream", amount: 90, unit: "ml" },
      { name: "Rice", amount: 180, unit: "g" },
    ],
    ratingBias: 4.1,
  },
  {
    name: "Fish au gratin",
    line: "Nordic",
    description: "Cod and potato gratin with cheese and breadcrumbs.",
    ecoScore: 1.5,
    ingredients: [
      { name: "Cod", amount: 140, unit: "g" },
      { name: "Potatoes", amount: 200, unit: "g" },
      { name: "Cheese", amount: 40, unit: "g" },
    ],
    ratingBias: 3.7,
  },
  {
    name: "Lamb meatballs",
    line: "Nordic",
    description: "Spiced lamb meatballs with yogurt-mint sauce.",
    ecoScore: 2.5,
    ingredients: [
      { name: "Lamb", amount: 140, unit: "g" },
      { name: "Yogurt", amount: 60, unit: "ml" },
      { name: "Bulgur", amount: 120, unit: "g" },
    ],
    ratingBias: 3.8,
  },
  {
    name: "Smoked herring on rye",
    line: "Nordic",
    description: "Open-faced smoked herring sandwich with egg and chives.",
    ecoScore: 0.9,
    ingredients: [
      { name: "Herring", amount: 80, unit: "g" },
      { name: "Egg", amount: 1, unit: "st" },
      { name: "Butter", amount: 15, unit: "g" },
    ],
    ratingBias: 3.3,
  },

  // ── Street food ───────────────────────────────────────────────────────
  {
    name: "Tacos",
    line: "Street food",
    description: "Soft tortillas with seasoned beef, corn salsa and lime.",
    ecoScore: 1.7,
    ingredients: [
      { name: "Beef", amount: 100, unit: "g" },
      { name: "Corn", amount: 80, unit: "g" },
      { name: "Tortilla", amount: 2, unit: "st" },
    ],
    ratingBias: 4.5,
  },
  {
    name: "Pulled pork bao",
    line: "Street food",
    description: "Steamed buns with slow-cooked pulled pork and pickles.",
    ecoScore: 1.9,
    ingredients: [
      { name: "Pork", amount: 130, unit: "g" },
      { name: "Bao bun", amount: 2, unit: "st" },
      { name: "Pickles", amount: 30, unit: "g" },
    ],
    ratingBias: 4.4,
  },
  {
    name: "Chicken kebab wrap",
    line: "Street food",
    description: "Grilled chicken, garlic yogurt and cabbage in a wrap.",
    ecoScore: 1.6,
    ingredients: [
      { name: "Chicken", amount: 140, unit: "g" },
      { name: "Yogurt", amount: 40, unit: "ml" },
      { name: "Tortilla", amount: 1, unit: "st" },
    ],
    ratingBias: 4.2,
  },
  {
    name: "Bulgogi rice bowl",
    line: "Street food",
    description: "Marinated beef over rice with kimchi and sesame.",
    ecoScore: 1.8,
    ingredients: [
      { name: "Beef", amount: 130, unit: "g" },
      { name: "Rice", amount: 200, unit: "g" },
      { name: "Kimchi", amount: 60, unit: "g" },
    ],
    ratingBias: 4.3,
  },
  {
    name: "Fish tacos",
    line: "Street food",
    description: "Beer-battered cod, slaw and chipotle mayo in soft shells.",
    ecoScore: 1.3,
    ingredients: [
      { name: "Cod", amount: 130, unit: "g" },
      { name: "Cabbage", amount: 80, unit: "g" },
      { name: "Tortilla", amount: 2, unit: "st" },
    ],
    ratingBias: 4.0,
  },
  {
    name: "Falafel pita",
    line: "Street food",
    description: "Chickpea falafel with tahini, salad and pickled turnip.",
    ecoScore: 0.6,
    ingredients: [
      { name: "Chickpeas", amount: 150, unit: "g" },
      { name: "Tahini", amount: 25, unit: "ml" },
      { name: "Pita", amount: 1, unit: "st" },
    ],
    ratingBias: 4.0,
  },
  {
    name: "Banh mi",
    line: "Street food",
    description: "Vietnamese baguette with pork, pickled veg and coriander.",
    ecoScore: 1.7,
    ingredients: [
      { name: "Pork", amount: 110, unit: "g" },
      { name: "Baguette", amount: 1, unit: "st" },
      { name: "Carrots", amount: 50, unit: "g" },
    ],
    ratingBias: 4.2,
  },
  {
    name: "Pad thai",
    line: "Street food",
    description: "Stir-fried rice noodles with egg, tofu, peanuts and lime.",
    ecoScore: 1.4,
    ingredients: [
      { name: "Noodles", amount: 200, unit: "g" },
      { name: "Egg", amount: 1, unit: "st" },
      { name: "Tofu", amount: 80, unit: "g" },
      { name: "Peanuts", amount: 20, unit: "g" },
    ],
    ratingBias: 4.1,
  },
  {
    name: "Smash cheeseburger",
    line: "Street food",
    description: "Double smash patty, cheese, onion and house sauce.",
    ecoScore: 2.7,
    ingredients: [
      { name: "Beef", amount: 160, unit: "g" },
      { name: "Cheese", amount: 30, unit: "g" },
      { name: "Bun", amount: 1, unit: "st" },
    ],
    ratingBias: 4.4,
  },
  {
    name: "Loaded bacon fries",
    line: "Street food",
    description: "Crispy fries with bacon, cheese sauce and scallions.",
    ecoScore: 2.3,
    ingredients: [
      { name: "Potatoes", amount: 220, unit: "g" },
      { name: "Bacon", amount: 50, unit: "g" },
      { name: "Cheese", amount: 40, unit: "g" },
    ],
    ratingBias: 3.9,
  },

  // ── Vegetarian ────────────────────────────────────────────────────────
  {
    name: "Vegetarian lasagna",
    line: "Vegetarian",
    description: "Layers of pasta, ricotta, spinach and tomato.",
    ecoScore: 1.1,
    ingredients: [
      { name: "Pasta", amount: 180, unit: "g" },
      { name: "Ricotta", amount: 80, unit: "g" },
      { name: "Spinach", amount: 100, unit: "g" },
    ],
    ratingBias: 4.0,
  },
  {
    name: "Halloumi bowl",
    line: "Vegetarian",
    description: "Grilled halloumi over couscous with roasted peppers.",
    ecoScore: 1.0,
    ingredients: [
      { name: "Cheese", amount: 100, unit: "g" },
      { name: "Couscous", amount: 150, unit: "g" },
      { name: "Peppers", amount: 100, unit: "g" },
    ],
    ratingBias: 4.1,
  },
  {
    name: "Mushroom risotto",
    line: "Vegetarian",
    description: "Creamy arborio risotto with mixed mushrooms and parmesan.",
    ecoScore: 1.0,
    ingredients: [
      { name: "Rice", amount: 180, unit: "g" },
      { name: "Mushrooms", amount: 120, unit: "g" },
      { name: "Butter", amount: 20, unit: "g" },
      { name: "Cheese", amount: 25, unit: "g" },
    ],
    ratingBias: 4.0,
  },
  {
    name: "Spinach and feta quiche",
    line: "Vegetarian",
    description: "Buttery short-crust quiche with spinach, feta and egg.",
    ecoScore: 1.2,
    ingredients: [
      { name: "Egg", amount: 2, unit: "st" },
      { name: "Cream", amount: 80, unit: "ml" },
      { name: "Spinach", amount: 90, unit: "g" },
      { name: "Cheese", amount: 60, unit: "g" },
    ],
    ratingBias: 3.8,
  },
  {
    name: "Chickpea curry",
    line: "Vegetarian",
    description: "Slow-simmered chickpeas in coconut and tomato curry.",
    ecoScore: 0.7,
    ingredients: [
      { name: "Chickpeas", amount: 180, unit: "g" },
      { name: "Coconut milk", amount: 120, unit: "ml" },
      { name: "Rice", amount: 160, unit: "g" },
    ],
    ratingBias: 4.2,
  },
  {
    name: "Lentil shepherd's pie",
    line: "Vegetarian",
    description: "Spiced lentils topped with mashed potato.",
    ecoScore: 0.6,
    ingredients: [
      { name: "Lentils", amount: 180, unit: "g" },
      { name: "Potatoes", amount: 220, unit: "g" },
      { name: "Carrots", amount: 80, unit: "g" },
    ],
    ratingBias: 3.9,
  },
  {
    name: "Vegan miso ramen",
    line: "Vegetarian",
    description: "Miso broth, ramen noodles, tofu and bok choi.",
    ecoScore: 0.8,
    ingredients: [
      { name: "Noodles", amount: 200, unit: "g" },
      { name: "Tofu", amount: 100, unit: "g" },
      { name: "Miso", amount: 30, unit: "g" },
    ],
    ratingBias: 4.0,
  },
  {
    name: "Roasted vegetable couscous",
    line: "Vegetarian",
    description: "Pearl couscous with roasted root vegetables and herbs.",
    ecoScore: 0.5,
    ingredients: [
      { name: "Couscous", amount: 180, unit: "g" },
      { name: "Carrots", amount: 100, unit: "g" },
      { name: "Squash", amount: 100, unit: "g" },
    ],
    ratingBias: 3.5,
  },
];

const COMMENTS_BY_RATING: Record<number, string[]> = {
  5: [
    "Best lunch this term.",
    "Hits the spot every time.",
    "Genuinely amazing, please keep this on rotation.",
    "Loved every bite.",
    "Don't change anything.",
    "Could eat this every day.",
  ],
  4: [
    "Pretty good.",
    "Solid lunch.",
    "Nice flavors.",
    "The sauce really makes it.",
    "Good portion.",
    "Would order again.",
  ],
  3: ["It was fine.", "Average.", "Decent.", "Nothing special."],
  2: [
    "A bit bland.",
    "Could be better.",
    "Too dry for me.",
    "Cold by the time I got to the front of the queue.",
    "Portion was small.",
  ],
  1: [
    "I had to throw most of it away.",
    "Tasted off.",
    "Way too salty.",
    "Inedible today.",
  ],
};

const TAGS_BY_RATING: Record<number, string[]> = {
  5: ["perfect", "loved it", "more please", "delicious", "balanced"],
  4: ["filling", "balanced", "fresh", "delicious"],
  3: [],
  2: ["bland", "dry", "small portion"],
  1: ["cold", "too salty", "overcooked", "too small"],
};

const SUGGESTIONS: SuggestionCreateInput[] = [
  {
    title: "Tacos",
    description: "I want more tacos because they are yummy!",
    postedDate: new Date(),
  },
  {
    title: "I'm confused",
    description:
      "Why are so many people complaining about the school food, it's delicious",
    postedDate: new Date("2026-05-11T13:24"),
  },
];

// Mulberry32 — small deterministic PRNG so reseeding gives identical data.
function makeRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickInt(rng: () => number, min: number, maxInclusive: number): number {
  return Math.floor(rng() * (maxInclusive - min + 1)) + min;
}

function sampleRating(rng: () => number, bias: number): number {
  // Two-sample average gives a centered distribution, then we nudge toward
  // the meal's bias so a popular lunch trends 4-5 and an unpopular one 2-3.
  const noise = (rng() + rng()) / 2; // 0..1, peak around 0.5
  const value = bias + (noise - 0.5) * 2.6;
  return Math.min(5, Math.max(1, Math.round(value)));
}

function pickComment(rng: () => number, rating: number): string | null {
  const pool = COMMENTS_BY_RATING[rating] ?? [];
  if (pool.length === 0) return null;
  // 5★ and 1★ comment more often; mid-ratings rarely leave a note.
  const chance = rating === 3 ? 0.1 : rating === 4 || rating === 2 ? 0.3 : 0.45;
  if (rng() > chance) return null;
  return pool[pickInt(rng, 0, pool.length - 1)];
}

function pickTags(rng: () => number, rating: number): string[] {
  const pool = TAGS_BY_RATING[rating] ?? [];
  if (pool.length === 0) return [];
  const count = pickInt(rng, 0, Math.min(2, pool.length));
  if (count === 0) return [];
  const shuffled = [...pool].sort(() => rng() - 0.5);
  return shuffled.slice(0, count);
}

// All serving dates are computed in UTC so the date Prisma writes to a
// @db.Date column lines up with PostgreSQL's view of weekdays and weeks
// regardless of where the seed is run.
function startOfUtcDay(date: Date): Date {
  const copy = new Date(date);
  copy.setUTCHours(0, 0, 0, 0);
  return copy;
}

function startOfWeekUtc(date: Date): Date {
  const monday = startOfUtcDay(date);
  const daysSinceMonday = (monday.getUTCDay() + 6) % 7; // 0 = Monday
  monday.setUTCDate(monday.getUTCDate() - daysSinceMonday);
  return monday;
}

function weekKey(date: Date): string {
  return startOfWeekUtc(date).toISOString().slice(0, 10);
}

function pastYearWeekdays(): Date[] {
  const today = startOfUtcDay(new Date());
  const days: Date[] = [];
  for (let daysAgo = 365; daysAgo >= 1; daysAgo--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - daysAgo);
    const weekday = d.getUTCDay();
    if (weekday === 0 || weekday === 6) continue;
    days.push(d);
  }
  return days;
}

function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function postedTimeOn(rng: () => number, servingDate: Date): Date {
  const posted = new Date(servingDate);
  const minutes = pickInt(rng, 11 * 60 + 30, 14 * 60 + 30);
  posted.setUTCHours(0, minutes, pickInt(rng, 0, 59), 0);
  return posted;
}

type ReviewSeed = {
  rating: number;
  comment: string | null;
  tags: string[];
  posted: Date;
  userId: null;
};

type ServingSeed = { date: Date; reviews: ReviewSeed[] };

function generateReviews(
  rng: () => number,
  lunch: LunchSeed,
  servingDate: Date,
  weekMood: number
): ReviewSeed[] {
  const count = pickInt(rng, 5, 10);
  return Array.from({ length: count }, () => {
    const rating = sampleRating(rng, lunch.ratingBias + weekMood);
    return {
      rating,
      comment: pickComment(rng, rating),
      tags: pickTags(rng, rating),
      posted: postedTimeOn(rng, servingDate),
      userId: null,
    };
  });
}

// Builds the weekday schedule: each weekday gets one lunch per line, and no
// lunch repeats inside the same Mon-Fri week. Within a week we walk a freshly
// shuffled order of that line's lunches, so the first 5 picks are always
// distinct.
function buildSchedule(rng: () => number): Map<string, ServingSeed[]> {
  const lunchesByLine: Record<MealLine, LunchSeed[]> = {
    Nordic: LUNCHES.filter(l => l.line === "Nordic"),
    Vegetarian: LUNCHES.filter(l => l.line === "Vegetarian"),
    "Street food": LUNCHES.filter(l => l.line === "Street food"),
  };

  for (const line of LINES) {
    if (lunchesByLine[line].length < 5) {
      throw new Error(
        `Need at least 5 lunches on the "${line}" line to avoid weekly repeats.`
      );
    }
  }

  const servingsByLunch = new Map<string, ServingSeed[]>(
    LUNCHES.map(l => [l.name, []])
  );

  let currentWeek = "";
  let weeklyOrder: Record<MealLine, LunchSeed[]> = {
    Nordic: [],
    Vegetarian: [],
    "Street food": [],
  };
  const weeklyIndex: Record<MealLine, number> = {
    Nordic: 0,
    Vegetarian: 0,
    "Street food": 0,
  };
  // Per-week mood offset applied to every review of that week — gives the
  // weekly-average KPIs real swing instead of converging on a flat mean.
  let weekMood = 0;

  for (const date of pastYearWeekdays()) {
    const wk = weekKey(date);
    if (wk !== currentWeek) {
      currentWeek = wk;
      weeklyOrder = {
        Nordic: shuffle(lunchesByLine.Nordic, rng),
        Vegetarian: shuffle(lunchesByLine.Vegetarian, rng),
        "Street food": shuffle(lunchesByLine["Street food"], rng),
      };
      weeklyIndex.Nordic = 0;
      weeklyIndex.Vegetarian = 0;
      weeklyIndex["Street food"] = 0;
      weekMood = (rng() - 0.5) * 1.4; // ±0.7
    }

    for (const line of LINES) {
      const lunch = weeklyOrder[line][weeklyIndex[line]];
      weeklyIndex[line] += 1;
      servingsByLunch.get(lunch.name)!.push({
        date,
        reviews: generateReviews(rng, lunch, date, weekMood),
      });
    }
  }

  return servingsByLunch;
}

async function main() {
  await prisma.review.deleteMany();
  await prisma.serving.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.lunch.deleteMany();
  await prisma.suggestion.deleteMany();

  const rng = makeRng(20260513);
  const schedule = buildSchedule(rng);

  let totalServings = 0;
  let totalReviews = 0;

  for (const lunch of LUNCHES) {
    const servings = schedule.get(lunch.name) ?? [];
    totalServings += servings.length;
    totalReviews += servings.reduce((sum, s) => sum + s.reviews.length, 0);

    await prisma.lunch.create({
      data: {
        name: lunch.name,
        line: lunch.line,
        description: lunch.description,
        ecoScore: lunch.ecoScore,
        ingredients: { create: lunch.ingredients },
        servings: {
          create: servings.map(s => ({
            date: s.date,
            reviews: { create: s.reviews },
          })),
        },
      },
    });
  }

  for (const suggestion of SUGGESTIONS) {
    await prisma.suggestion.create({
      data: suggestion,
    });
  }

  console.log(
    `Seeded ${LUNCHES.length} lunches, ${totalServings} servings, ${totalReviews} reviews, ${SUGGESTIONS.length} suggestions.`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
