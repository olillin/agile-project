'use server';
import { Ingredient, Lunch } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { Day } from "@/lib/types";

export async function getAll() {
    return await prisma.lunch.findMany();
}



export async function getLunch(identifier: number | string): Promise<Lunch | Lunch[] | null> {
    if (typeof identifier === 'number') {
        return await prisma.lunch.findUnique({
            where: { id: identifier }
        });
    }
    if (typeof identifier === 'string') {
        return await prisma.lunch.findUnique({
            where: { name: identifier }
        });
    }
    return null;
}

export async function getLunchesByDate(date: Date): Promise<Lunch[]> {
    return await prisma.lunch.findMany({
        where: { servings: { has: date } }
    });
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

export async function getDays(): Promise<Day[]> {
    let dayMap = new Map<Date, Lunch[]>();
    const lunches = await getAll();

    lunches.forEach((lunch) => {
        lunch.servings.forEach((date) => {
            let ls = dayMap.get(date);
            if (ls == undefined) {
                dayMap.set(date, [lunch]);
            } else {
                ls.push(lunch);
                dayMap.set(date, ls);
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
                    id: lunch.id.toString(),
                    line: "Vegetarian",
                    name: lunch.name,
                    color: "#C87865",
                    pattern: 45,
                    tags: [],
                    climate: lunch.eco_score,
                    climateLabel: "low",
                    desc: "f",
                };
            }),
        });
    });

    return days;
}
