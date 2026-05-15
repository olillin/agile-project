import {
  getAdminMealCatalog,
  getAdminMealDetail,
  getAdminMealTrend,
  getAdminOverview,
  getAdminOverviewTrend,
} from "@/services/statisticsService";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  lunch: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
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

  it("returns safe empty admin overview data", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-13T10:30:00.000Z"));

    prismaMock.review.findMany.mockResolvedValue([]);
    prismaMock.lunch.findMany.mockResolvedValue([]);

    const overview = await getAdminOverview("7d");

    expect(overview.meals).toEqual([]);
    expect(overview.kpis.map(kpi => kpi.value)).toEqual(["0.0", "0", "0"]);
    expect(overview.trend.xLabels).toHaveLength(7);
    expect(overview.trend.series).toHaveLength(3);
    expect(overview.trend.series.flatMap(series => series.data)).toEqual(
      Array.from({ length: 21 }, () => 0)
    );
  });

  it("aggregates admin meal catalog stats from lunch servings and reviews", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-13T10:30:00.000Z"));

    prismaMock.lunch.findMany.mockResolvedValue([
      {
        id: 2,
        name: "Tacos",
        line: "Street food",
        ecoScore: 1.7,
        ingredients: [
          { id: 1, name: "Beef mince", amount: 100, unit: "g", lunchId: 2 },
        ],
        servings: [
          {
            id: 10,
            date: new Date("2026-05-12T00:00:00.000Z"),
            reviews: [
              {
                id: 100,
                rating: 5,
                comment: "Great",
                tags: ["fresh"],
                posted: new Date("2026-05-13T08:00:00.000Z"),
              },
              {
                id: 101,
                rating: 4,
                comment: null,
                tags: [],
                posted: new Date("2026-05-13T09:00:00.000Z"),
              },
            ],
          },
        ],
      },
    ]);

    await expect(getAdminMealCatalog()).resolves.toEqual([
      expect.objectContaining({
        id: "2",
        name: "Tacos",
        line: "Street food",
        tags: ["meat"],
        rating: 4.5,
        votes: 2,
        distribution: [0, 0, 0, 1, 1],
        co2: 1.7,
        climate: "med",
        lastServed: "Yesterday",
        timesServed: 1,
      }),
    ]);
  });

  it("builds admin meal detail comments, tag frequencies, and distribution", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-13T10:30:00.000Z"));

    prismaMock.lunch.findUnique.mockResolvedValue({
      id: 2,
      name: "Tacos",
      line: "Street food",
      ecoScore: 1.7,
      ingredients: [
        { id: 1, name: "Beef mince", amount: 100, unit: "g", lunchId: 2 },
      ],
      servings: [
        {
          id: 10,
          date: new Date("2026-05-12T00:00:00.000Z"),
          reviews: [
            {
              id: 100,
              rating: 5,
              comment: "Great",
              tags: ["fresh", "more please"],
              posted: new Date("2026-05-13T08:00:00.000Z"),
            },
            {
              id: 101,
              rating: 2,
              comment: "Too cold",
              tags: ["cold", "fresh"],
              posted: new Date("2026-05-13T09:00:00.000Z"),
            },
          ],
        },
      ],
    });

    const detail = await getAdminMealDetail(2);

    expect(detail).toEqual(
      expect.objectContaining({
        id: "2",
        distribution: [0, 1, 0, 0, 1],
        comments: [
          expect.objectContaining({ id: 101, text: "Too cold" }),
          expect.objectContaining({ id: 100, text: "Great" }),
        ],
        tagBars: [
          expect.objectContaining({ label: "fresh", count: 2 }),
          expect.objectContaining({ label: "cold", count: 1 }),
          expect.objectContaining({ label: "more please", count: 1 }),
        ],
      })
    );
  });

  it("groups overview trend daily averages by meal line", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-13T10:30:00.000Z"));

    prismaMock.review.findMany
      .mockResolvedValueOnce([
        {
          rating: 1,
          serving: {
            date: new Date("2026-05-12T00:00:00.000Z"),
            lunch: { line: "Nordic" },
          },
        },
        {
          rating: 5,
          serving: {
            date: new Date("2026-05-13T00:00:00.000Z"),
            lunch: { line: "Nordic" },
          },
        },
        {
          rating: 3,
          serving: {
            date: new Date("2026-05-13T00:00:00.000Z"),
            lunch: { line: "Vegetarian" },
          },
        },
      ])
      .mockResolvedValueOnce([{ rating: 2 }]);

    const trend = await getAdminOverviewTrend("7d");
    const nordic = trend.series.find(series => series.name === "Nordic");
    const vegetarian = trend.series.find(
      series => series.name === "Vegetarian"
    );

    expect(trend.xLabels).toEqual([
      "Thu",
      "Fri",
      "Sat",
      "Sun",
      "Mon",
      "Tue",
      "Wed",
    ]);
    expect(nordic?.data).toEqual([0, 0, 0, 0, 0, 1, 5]);
    expect(vegetarian?.data).toEqual([0, 0, 0, 0, 0, 0, 3]);
    expect(trend.footnotes).toEqual([
      expect.objectContaining({
        label: "Best day",
        sub: "4.0 avg · 2 ratings",
      }),
      expect.objectContaining({
        label: "Worst day",
        sub: "1.0 avg · 1 ratings",
      }),
      expect.objectContaining({ label: "Range delta", value: "↑ 1" }),
    ]);
  });

  it("groups overview trend weekly averages for the 1y range", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-13T10:30:00.000Z"));

    prismaMock.review.findMany
      .mockResolvedValueOnce([
        {
          rating: 5,
          serving: {
            date: new Date("2025-07-15T00:00:00.000Z"),
            lunch: { line: "Nordic" },
          },
        },
        {
          rating: 1,
          serving: {
            date: new Date("2025-11-10T00:00:00.000Z"),
            lunch: { line: "Nordic" },
          },
        },
      ])
      .mockResolvedValueOnce([{ rating: 3 }]);

    const trend = await getAdminOverviewTrend("1y");
    const nordic = trend.series.find(series => series.name === "Nordic");

    // 53 Mondays span the 365-day window from 2025-05-12.
    expect(trend.xLabels).toHaveLength(53);
    expect(nordic?.data).toHaveLength(53);
    // One month label per calendar month → 12 labels visible.
    expect(trend.xLabels.filter(label => label !== "")).toHaveLength(12);
    expect(trend.xLabels).toContain("Jul");
    expect(trend.xLabels).toContain("Nov");
    expect(nordic?.data.filter(value => value > 0)).toEqual([5, 1]);
    expect(trend.footnotes).toEqual([
      expect.objectContaining({
        label: "Best week",
        sub: "5.0 avg · 1 ratings",
      }),
      expect.objectContaining({
        label: "Worst week",
        sub: "1.0 avg · 1 ratings",
      }),
      expect.objectContaining({ label: "Range delta" }),
    ]);
  });

  it("orders meal trend ratings chronologically", async () => {
    prismaMock.lunch.findUnique.mockResolvedValue({
      id: 2,
      servings: [
        {
          id: 11,
          date: new Date("2026-05-13T00:00:00.000Z"),
          reviews: [{ rating: 5 }],
        },
        {
          id: 10,
          date: new Date("2026-05-10T00:00:00.000Z"),
          reviews: [{ rating: 1 }, { rating: 3 }],
        },
      ],
    });

    await expect(getAdminMealTrend(2, 30)).resolves.toEqual({
      xLabels: ["10 May", "13 May"],
      series: [
        {
          name: "avg",
          color: "var(--color-tea)",
          data: [2, 5],
        },
      ],
    });
  });
});
