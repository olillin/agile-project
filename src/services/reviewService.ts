import { Ingredient, Lunch, Prisma, Review } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";


export async function addReview(rating: number, lunchId: number, user?: number, comment?: string) {

    let currentDate = new Date(Date.now())

    const review = prisma.review.create({
        data: {
            rating: rating,
            comment: comment,
            date: currentDate,
            lunchId: lunchId,
            userId: user
        }
    })
    return review
}
