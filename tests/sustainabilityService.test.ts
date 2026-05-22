import { describe } from "node:test";
import { getEcoScore } from "@/services/sustainabilityService";
import { expect, test } from "vitest";

describe("getEcoScore", () => {
  test("returns a score for beef", async () => {
    const score = await getEcoScore([{ name: "beef", amount: 100, unit: "g" }]);
    expect(score).toBeDefined();
    expect(score).toBeCloseTo(9.291159216, 5);
  });

  test("multiple ingredients", async () => {
    const score = await getEcoScore([
      { name: "milk", amount: 200, unit: "g" },
      { name: "sugar", amount: 45, unit: "g" },
      { name: "cornstarch", amount: 30, unit: "g" },
    ]);
    expect(score).toBeDefined();
    expect(score).toBeCloseTo(0.7814742544650001, 5);
  });
});
