import { describe } from "node:test";
import { getEcoScore } from "@/services/sustainabilityService";
import { expect, test } from "vitest";

describe("getEcoScore", () => {
  test("returns a score for beef", async () => {
    const score = await getEcoScore([{ name: "beef", amount: 100, unit: "g" }]);
    expect(score).toBeDefined();
    expect(score).toBeCloseTo(9.29115921655555555, 5);
  });

  test("multiple ingredients", async () => {
    const score = await getEcoScore([
      { name: "milk", amount: 2, unit: "dl" },
      { name: "sugar", amount: 45, unit: "ml" },
      { name: "cornstarch", amount: 30, unit: "ml" },
    ]);
    expect(score).toBeDefined();
    expect(score).toBeCloseTo(0.7855314915881078, 5);
  });
});
