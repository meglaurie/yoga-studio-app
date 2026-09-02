import { prisma } from '@/lib/prisma';

export async function getClassesForDate(
  date: string,
) {
  const startOfDay = new Date(`${date}T00:00:00`);
  const endOfDay = new Date(`${date}T23:59:59.999`);

  return prisma.class.findMany({
    where: {
      startAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      bookings: {
        where: {
          status: 'CONFIRMED',
        },
        select: {
          id: true,
          attendeeCount: true,
          userId: true,
        },
      },
    },
    orderBy: {
      startAt: 'asc',
    },
  });
}