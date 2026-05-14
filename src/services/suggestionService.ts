"use server";

import { SUGGESTIONS } from "@/lib/admin/fixtures";
import { prisma } from "@/lib/prisma";
import type { Suggestion } from "@/generated/prisma/client";



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
  return Promise.resolve(
    SUGGESTIONS.find(suggestion => suggestion.id === id) ?? null
  );
}

export async function getAllSuggestions(): Promise<Suggestion[]> {
  return await prisma.suggestion.findMany();
}

export async function createSuggestion(title: string, description: string) { }

export async function updateLastVisited() { }
