"use server";

import { Review } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  ReviewServiceNotFoundError,
  ReviewUserNotFoundError,
  ReviewValidationError,
} from "@/services/reviewErrors";

type AddReviewInput = {
  rating: number;
  serviceId: number;
  comment?: string;
  tags?: string[];
  userId?: number | null;
};

function cleanTags(tags: string[] = []): string[] {
  return [...new Set(tags.map(tag => tag.trim()).filter(Boolean))];
}

export async function addReview({
  rating,
  servingId,
  comment,
  tags = [],
  userId = null,
}: AddReviewInput) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new ReviewValidationError("rating must be an integer from 1 to 5");
  }

  const serving = await prisma.serving.findUnique({
    where: { id: servingId },
    select: { id: true },
  });

  if (!serving) {
    throw new ReviewServingNotFoundError(`serving ${servingId} does not exist`);
  }

  if (userId !== null) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new ReviewUserNotFoundError(`user ${userId} does not exist`);
    }
  }

  const review = await prisma.review.create({
    data: {
      rating,
      comment: comment?.trim() || null,
      tags: cleanTags(tags),
      posted: new Date(),
      servingId,
      userId,
    },
  });
  return review;
}

export async function getAll() {
  return await prisma.review.findMany();
}

export async function getReviewsByLunchId(lunchId: number): Promise<Review[]> {
  const reviews = await prisma.review.findMany({
    where: { lunchId },
  });

  return reviews;
}

export async function getReviewedServingIds(): Promise<string[]> {
  const reviews = await prisma.review.findMany({
    select: { servingId: true },
  });

  return [...new Set(reviews.map(review => review.servingId.toString()))];
}

export async function getReview(id: number) {
  return await prisma.review.findUnique({
    where: { id: id },
  });
}
