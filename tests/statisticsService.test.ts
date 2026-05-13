import { getKpiStats, getMealStats } from "@/services/statisticsService";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  lunch: {
    findMany: vi.fn(),
  },
  review: {
    findMany: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

describe("statisticsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("aggregates meal ratings across servings", async () => {
    prismaMock.lunch.findMany.mockResolvedValue([
      {
        id: 2,
        name: "Tacos",
        ecoScore: 1.7,
        servings: [
          {
            date: new Date("2026-05-01T00:00:00.000Z"),
            reviews: [{ rating: 5 }, { rating: 4 }],
          },
          {
            date: new Date("2026-05-03T00:00:00.000Z"),
            reviews: [{ rating: 3 }],
          },
        ],
      },
      {
        id: 3,
        name: "Soup",
        ecoScore: 0.8,
        servings: [],
      },
    ]);

    await expect(getMealStats()).resolves.toEqual([
      {
        id: "2",
        name: "Tacos",
        ecoScore: 1.7,
        votes: 3,
        rating: 4,
        distribution: [0, 0, 1, 1, 1],
        lastServed: new Date("2026-05-03T00:00:00.000Z"),
      },
      {
        id: "3",
        name: "Soup",
        ecoScore: 0.8,
        votes: 0,
        rating: null,
        distribution: [0, 0, 0, 0, 0],
        lastServed: null,
      },
    ]);

    expect(prismaMock.lunch.findMany).toHaveBeenCalledWith({
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
  });

  it("calculates weekly KPI stats from review posted timestamps", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-13T10:30:00.000Z"));

    prismaMock.review.findMany.mockResolvedValue([
      {
        rating: 4,
        comment: "Great",
        posted: new Date("2026-05-11T09:00:00.000Z"),
      },
      {
        rating: 5,
        comment: " ",
        posted: new Date("2026-05-13T08:00:00.000Z"),
      },
      {
        rating: 3,
        comment: null,
        posted: new Date("2026-05-13T09:00:00.000Z"),
      },
    ]);

    await expect(getKpiStats()).resolves.toEqual({
      avgRatingThisWeek: 4,
      ratingsToday: 2,
      commentsThisWeek: 1,
    });

    expect(prismaMock.review.findMany).toHaveBeenCalledWith({
      where: {
        posted: {
          gte: new Date(2026, 4, 11),
        },
      },
    });
  });
});
