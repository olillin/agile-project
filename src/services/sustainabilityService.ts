"use server";

import { IngredientRow } from "@/lib/admin/types";
import { NewIngredient } from "./lunchService";

const apiUrl = (
  process.env.GREEN_BITE_API_URL || "http://localhost:80"
).replace(/\/$/, "");

// Green Bite's parser only handles full unit words. Short codes like "g" get
// parsed as the ingredient name, producing a garlic-matched fallback score.
function formatIngredient({ amount, unit, name }: NewIngredient): string {
  switch (unit) {
    case "g":
      return `${amount} grams of ${name}`;
    case "kg":
      return `${amount} kg of ${name}`;
    case "st":
      return `${amount} ${name}`;
  }
}

export async function getEcoScore(
  ingredients: IngredientRow[] | NewIngredient[]
): Promise<number> {
  const query = ingredients
    .map(
      ingredient =>
        `ingredients=${encodeURIComponent(formatIngredient(ingredient))}`
    )
    .join("&");

  const response = await fetch(`${apiUrl}/score?${query}`, {
    method: "POST",
  });

  if (response.status !== 200) {
    throw new Error("Failed to get eco score from Green Bite API");
  }

  const text = await response.text();
  const score = parseFloat(text);

  if (isNaN(score)) {
    throw new Error(
      "Received invalid response from Green Bite API, score is not a number"
    );
  }

  return score;
}
