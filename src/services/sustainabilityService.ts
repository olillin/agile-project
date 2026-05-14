"use server";

import { Ingredient } from "@/lib/admin/types";

const apiUrl = process.env.GREEN_BITE_API_URL || "http://localhost:80/";

export async function getEcoScore(ingredients: Ingredient[]): Promise<number> {
  let call = apiUrl + "/score?";

  call += ingredients
    .map(
      ({ amount, unit, name }) =>
        `ingredients=${encodeURIComponent(`${amount} ${unit} of ${name}`)}`
    )
    .join("&");

  const response = await fetch(call, {
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
