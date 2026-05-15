"use server";

import { User } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/session";

export async function getUser(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await verifySession();
  return prisma.user.findUnique({
    where: { id: session.sub },
  });
}
