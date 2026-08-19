import { prisma } from "@/lib/prisma";

export async function getMemberDashboardData(userId: string) {
  const now = new Date();

  const [user, upcomingBookings, classPasses, activeMembership, purchases] =
    await Promise.all([
      prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          name: true,
          email: true,
          role: true,
        },
      }),

      prisma.booking.findMany({
        where: {
          userId,
          status: "CONFIRMED",
          class: {
            startAt: {
              gt: now,
            },
          },
        },
        include: {
          class: true,
        },
        orderBy: {
          class: {
            startAt: "asc",
          },
        },
      }),

      prisma.classPass.findMany({
        where: {
          userId,
          purchase: {
            status: "PAID",
          },
        },
        include: {
          purchase: {
            include: {
              product: true,
            },
          },
        },
        orderBy: [
          {
            expiresAt: "asc",
          },
          {
            createdAt: "desc",
          },
        ],
      }),

      prisma.membership.findFirst({
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
        include: {
          purchase: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          expiresAt: "desc",
        },
      }),

      prisma.purchase.findMany({
        where: {
          userId,
        },
        include: {
          product: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    user,
    upcomingBookings,
    classPasses,
    activeMembership,
    purchases,
  };
}