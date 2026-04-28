'use server';
import { Ingredient } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function getAll() {
    return await prisma.lunch.findMany();
}

export async function getLunch(id: number) {
    return await prisma.lunch.findUnique({
        where: { id }
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