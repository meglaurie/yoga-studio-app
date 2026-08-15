import { prisma } from "@/lib/prisma";

export async function getActiveMembership(userId: string) {
  const now = new Date();

  return prisma.membership.findFirst({
    where: {
      userId,
      startsAt: {
        lte: now,
      },
      expiresAt: {
        gt: now,
      },
      purchase: {
        status: "PAID",
      },
    },
    orderBy: {
      expiresAt: "desc",
    },
  });
}

export async function hasActiveMembership(userId: string) {
  const membership = await getActiveMembership(userId);

  return membership !== null;
}