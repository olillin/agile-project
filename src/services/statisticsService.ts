import { prisma } from "@/lib/prisma";

type RatingDistribution = [number, number, number, number, number];

export type MealStats = {
  id: string;
  name: string;
  ecoScore: number;
  votes: number;
  rating: number | null;
  distribution: RatingDistribution;
  lastServed: Date | null;
};

export type KpiStats = {
  avgRatingThisWeek: number;
  ratingsToday: number;
  commentsThisWeek: number;
};

function isValidRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

function getStartOfToday(now: Date): Date {
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  return startOfToday;
}

function getStartOfWeek(now: Date): Date {
  const startOfWeek = getStartOfToday(now);
  const daysSinceMonday = (startOfWeek.getDay() + 6) % 7;
  startOfWeek.setDate(startOfWeek.getDate() - daysSinceMonday);
  return startOfWeek;
}

function averageRating(ratings: number[]): number | null {
  if (ratings.length === 0) return null;
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
}

function getDistribution(ratings: number[]): RatingDistribution {
  const distribution: RatingDistribution = [0, 0, 0, 0, 0];

  for (const rating of ratings) {
    distribution[rating - 1] += 1;
  }

  return distribution;
}

export async function getMealStats(): Promise<MealStats[]> {
  const lunches = await prisma.lunch.findMany({
    include: {
      servings: {
        include: {
          reviews: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return lunches.map(lunch => {
    const ratings = lunch.servings
      .flatMap(serving => serving.reviews.map(review => review.rating))
      .filter(isValidRating);
    const lastServed =
      lunch.servings.length > 0
        ? new Date(
            Math.max(...lunch.servings.map(serving => serving.date.getTime()))
          )
        : null;

    return {
      id: String(lunch.id),
      name: lunch.name,
      ecoScore: lunch.ecoScore,
      votes: ratings.length,
      rating: averageRating(ratings),
      distribution: getDistribution(ratings),
      lastServed,
    };
  });
}

export async function getKpiStats(): Promise<KpiStats> {
  const now = new Date();
  const startOfToday = getStartOfToday(now);
  const startOfWeek = getStartOfWeek(now);

  const weekReviews = await prisma.review.findMany({
    where: {
      posted: {
        gte: startOfWeek,
      },
    },
  });

  const ratings = weekReviews
    .map(review => review.rating)
    .filter(isValidRating);
  const avgRating = averageRating(ratings) ?? 0;
  const ratingsToday = weekReviews.filter(
    review => review.posted >= startOfToday && isValidRating(review.rating)
  ).length;
  const commentsThisWeek = weekReviews.filter(review =>
    review.comment?.trim()
  ).length;

  return {
    avgRatingThisWeek: Math.round(avgRating * 10) / 10,
    ratingsToday,
    commentsThisWeek,
  };
}
