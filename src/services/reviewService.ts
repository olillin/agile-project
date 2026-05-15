"use server";

import { Prisma } from "@/generated/prisma/client";
import { readClientId } from "@/lib/clientId";
import { prisma } from "@/lib/prisma";
import {
  ReviewAlreadyExistsError,
  ReviewServingNotFoundError,
  ReviewUserNotFoundError,
  ReviewValidationError,
} from "@/services/reviewErrors";

type AddReviewInput = {
  rating: number;
  servingId: number;
  comment?: string;
  tags?: string[];
  userId?: string | null;
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

  const clientId = (await readClientId()) ?? null;

  if (clientId) {
    const existing = await prisma.review.findFirst({
      where: { clientId, servingId },
      select: { id: true },
    });
    if (existing) {
      throw new ReviewAlreadyExistsError(
        `serving ${servingId} already reviewed by this client`
      );
    }
  }

  try {
    return await prisma.review.create({
      data: {
        rating,
        comment: comment?.trim() || null,
        tags: cleanTags(tags),
        posted: new Date(),
        servingId,
        userId,
        clientId,
      },
    });
  } catch (e) {
    // Race condition between the findFirst guard and the create: the DB
    // unique index catches the duplicate.
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      throw new ReviewAlreadyExistsError(
        `serving ${servingId} already reviewed by this client`
      );
    }
    throw e;
  }
}

export async function getAll() {
  return await prisma.review.findMany();
}

export async function getMyReviewSummaries(): Promise<
  { servingId: string; rating: number }[]
> {
  const clientId = await readClientId();
  if (!clientId) return [];

  const reviews = await prisma.review.findMany({
    where: { clientId },
    select: { servingId: true, rating: true },
    orderBy: { posted: "desc" },
  });

  const seen = new Map<number, number>();
  for (const r of reviews)
    if (!seen.has(r.servingId)) seen.set(r.servingId, r.rating);

  return [...seen].map(([servingId, rating]) => ({
    servingId: servingId.toString(),
    rating,
  }));
}

export async function getReview(id: number) {
  return await prisma.review.findUnique({
    where: { id: id },
  });
}
