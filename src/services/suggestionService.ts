"use server";

import type { Suggestion } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/session";

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

export async function submitSuggestion(formData: FormData) {
  const rawFormData = {
    title: formData.get("title"),
    description: formData.get("description"),
  };

  if (typeof rawFormData.title != "string") {
    throw new Error("Title must be string");
  }
  if (typeof rawFormData.description != "string") {
    throw new Error("Description must be string");
  }

  const review = await createSuggestion(
    rawFormData.title,
    rawFormData.description
  );
  return review;
}
