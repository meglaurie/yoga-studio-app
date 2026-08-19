import { prisma } from "@/lib/prisma";

export async function getOwnerDashboardData() {
  const now = new Date();

  const [
    memberCount,
    upcomingClasses,
    upcomingBookingCount,
    activeMembershipCount,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        role: "MEMBER",
      },
    }),

    prisma.class.findMany({
      where: {
        startAt: {
          gte: now,
        },
      },
      orderBy: {
        startAt: "asc",
      },
      take: 6,
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    }),

    prisma.booking.count({
      where: {
        status: "CONFIRMED",
        class: {
          startAt: {
            gte: now,
          },
        },
      },
    }),

    prisma.membership.count({
      where: {
        startsAt: {
          lte: now,
        },
        expiresAt: {
          gte: now,
        },
      },
    }),
  ]);

  return {
    memberCount,
    upcomingClasses,
    upcomingBookingCount,
    activeMembershipCount,
  };
}