'use server';
import { Ingredient } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { Day } from "@/lib/types";

export async function getAll() {
    return await prisma.lunch.findMany();
}



export async function getLunch(id_or_name: number | string) {
    if (typeof id_or_name === 'number') {
        return await prisma.lunch.findUnique({
            where: { id: id_or_name }
        });
    }
    if (typeof id_or_name === 'string') {
        return await prisma.lunch.findUnique({
            where: { name: id_or_name }
        });
    }
}

export async function deleteLunch(id: number) {
    return await prisma.lunch.delete({
        where: { id }
    })
}

export async function addlunch(
    name: string,
    ingredients: Ingredient[],
) {
    const lunch = await prisma.lunch.create({
        data: {
            name: name,
            eco_score: NaN,
            ingredients: {
                create: ingredients.map((ingredients) => ({
                    name: ingredients.name,
                    unit: ingredients.unit,
                    amount: ingredients.amount
                }))
            },
            reviews: {
                create: [

                ]
            }
        }
    })
    return lunch;
}

export async function getDays(): Day[] {
    let dayMap = new Map<Date, Lunch[]>();
    const lunches = await getAll();

    lunches.forEach((lunch) => {
        lunch.servings.forEach((date) => {
            let ls = dayMap.get(date);
            if (ls == undefined) {
                dayMap.set(date, [lunch]);
            } else {
                ls.push(lunch);
                dayMap.set(date,);
            }
        });
    });

    let days: Day[] = [];
    dayMap.forEach((options, date) => {
        days.push({
            id: "a",
            label: "b",
            date: date.toString(),
            isToday: true,
            options: options.map((lunch) => {
                return {
                    id: lunch.id,
                    line: "d",
                    name: lunch.name,
                    color: "#C87865",
                    pattern: 45,
                    tags: [],
                    climate: lunch.eco_score,
                    climateLabel: "e",
                    desc: "f",
                };
            }),
        });
    });

    return days;
}
