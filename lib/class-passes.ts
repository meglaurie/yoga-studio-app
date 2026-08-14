import { prisma } from "@/lib/prisma";

export async function getUsableClassPasses(userId: string) {
  const now = new Date();

  return prisma.classPass.findMany({
    where: {
      userId,
      remainingCredits: {
        gt: 0,
      },
      expiresAt: {
        gt: now,
      },
      purchase: {
        status: "PAID",
      },
    },
    orderBy: [
      {
        expiresAt: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });
}