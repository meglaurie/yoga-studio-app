import { prisma } from '@/lib/prisma';

export async function getClassesForDate(
  date: string,
  userId?: string,
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
    _count: {
        select: {
        bookings: {
            where: {
            status: 'CONFIRMED',
            },
        },
        },
    },

    bookings: userId
        ? {
            where: {
            userId,
            status: 'CONFIRMED',
            },
            select: {
            id: true,
            },
        }
        : undefined,
    },
    orderBy: {
      startAt: 'asc',
    },
  });
}