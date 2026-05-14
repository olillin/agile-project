"use server";

import { prisma } from "@/lib/prisma";
import type { Suggestion } from "@/generated/prisma/client";

export class SuggestionUserNotFoundError extends Error { }

/**
 * Check if a suggestion was posted after the admin page was viewed last.
 * @param suggestion The suggestion to check.
 * @returns If the suggestion is new.
 */
export function isNewSuggestion(suggestion: Suggestion): boolean {
  // TODO: Fetch actual last viewed time
  const lastViewedTime = new Date("2026-05-11T17:00");
  return suggestion.postedDate > lastViewedTime;
}

export async function getSuggestionById(
  id: number
): Promise<Suggestion | null> {
  return prisma.suggestion.findUnique({
    where: {
      id
    }
  })
}

export async function getAllSuggestions(): Promise<Suggestion[]> {
  return await prisma.suggestion.findMany();
}

export async function createSuggestion(title: string, description: string, userId: number | null = null) {
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
      postedDate: new Date()
    }
  })

}

export async function updateLastVisited() { }
