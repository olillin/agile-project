const api_url = "http://127.0.0.1:80/"

type Ingredient = {
    name: string,
    amount: number,
    unit: string
};

export async function eco_score(ingredients: Ingredient[]) {

    let call = api_url + "score?ingredients="

    call += ingredients.map(i => `${i.amount}%22${i.name}%20${i.unit}%22`).join("%2C")

    let data = await fetch(call, {
        method: 'POST'
    })
    return data.json()
}