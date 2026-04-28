"use server";

const api_url = process.env.GREEN_BITE_API_URL || "http://localhost:80/";

type Ingredient = {
  name: string;
  amount: number;
  unit: string;
};

export async function eco_score(ingredients: Ingredient[]) {
  let call = api_url + "score?";

  call += ingredients
    .map(
      ({ amount, unit, name }) =>
        `ingredients=${encodeURIComponent(`${amount} ${unit} of ${name}`)}`
    )
    .join("&");

  const data = await fetch(call, {
    method: "POST",
  });
  return data.json();
}
