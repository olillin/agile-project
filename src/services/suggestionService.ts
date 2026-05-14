"use server";

import type { Suggestion } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/session";

export class SuggestionUserNotFoundError extends Error {}

/**
 * Check if a suggestion was posted after the admin page was viewed last.
 * @param suggestion The suggestion to check.
 * @returns If the suggestion is new.
 */
export async function isNewSuggestion(
  suggestion: Suggestion
): Promise<boolean> {
  // TODO: Fetch actual last viewed time
  const session = await verifySession();
  const user = await prisma.user.findUnique({
    where: { id: session.sub },
  });

  if (user == null) return true;
  const lastViewedTime = user.LastTimeReviewsViewed;
  if (lastViewedTime == null) return true;
  return suggestion.postedDate > lastViewedTime;
}

export async function getSuggestionById(
  id: number
): Promise<Suggestion | null> {
  return prisma.suggestion.findUnique({
    where: {
      id,
    },
  });
}

export async function getAllSuggestions(): Promise<Suggestion[]> {
  return await prisma.suggestion.findMany();
}

export async function createSuggestion(
  title: string,
  description: string,
  userId: string | null = null
) {
  if (userId !== null) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) {
      throw new Error(`user ${userId} does not exist`);
    }
  }

  const suggestion = await prisma.suggestion.create({
    data: {
      title,
      description,
      postedDate: new Date(),
    },
  });

  return suggestion;
}

export async function updateLastVisited() {
  const session = await verifySession();

  prisma.user.upsert({
    where: {
      id: session.sub,
    },
    update: {
      lastTimeReviewsViewed: new Date(),
    },
    create: {
      id: session.sub,
      name: session.given_name,
      lastTimeReviewsViewed: new Date(),
    },
  });
}
