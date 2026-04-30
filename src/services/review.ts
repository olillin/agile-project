
import { prisma } from "@/lib/prisma";

export async function createReview(
    lunchId: number,
    rating: number,
    comment: string | null,
    userId?: number
) {
    return await prisma.review.create({
        data: {
            rating,
            comment,
            date: new Date(),
            lunchId,
            userId: userId ?? null,
        }
    });
}