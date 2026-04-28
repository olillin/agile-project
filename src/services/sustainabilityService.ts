"use server";

const api_url = process.env.GREEN_BITE_API_URL || "http://localhost:80/";

type Ingredient = {
  name: string;
  amount: number;
  unit: string;
};

export async function eco_score(ingredients: Ingredient[]) {
  let call = api_url + "score?ingredients=";

  call += ingredients
    .map(i => `${i.amount}%22${i.name}%20${i.unit}%22`)
    .join("%2C");

  const data = await fetch(call, {
    method: "POST",
  });
  return data.json();
}
