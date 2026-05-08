import { describe } from "node:test";
import { getEcoScore } from "@/services/sustainabilityService";
import { expect, test } from "vitest";

describe("getEcoScore", () => {
  test("returns a score for beef", async () => {
    const score = await getEcoScore([
      { name: "beef", amount: 100, unit: "grams" },
    ]);
    expect(score).toBeDefined();
    expect(score).toBeCloseTo(9.29115921655555555, 5);
  });

  test("multiple ingredients", async () => {
    const score = await getEcoScore([
      { name: "milk", amount: 1, unit: "cups" },
      { name: "sugar", amount: 3, unit: "tablespoons" },
      { name: "cornstarch", amount: 2, unit: "tablespoons" },
    ]);
    expect(score).toBeDefined();
    expect(score).toBeCloseTo(0.7855314915881078, 5);
  });
});
