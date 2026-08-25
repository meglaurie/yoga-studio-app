import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { calculateCreditsRequired } from "@/lib/booking-credits";
import { getUsableClassPasses } from "@/lib/class-passes";
import { allocateCredits } from "@/lib/credit-allocation";

const MAX_TRANSACTION_RETRIES = 3;

export class BookingError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "BookingError";
    this.status = status;
  }
}

export function isTransactionConflict(error: unknown) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2034"
  ) {
    return true;
  }

  const cause =
    typeof error === "object" &&
    error !== null &&
    "cause" in error
      ? error.cause
      : null;

  if (
    typeof cause === "object" &&
    cause !== null &&
    "originalCode" in cause &&
    cause.originalCode === "40001"
  ) {
    return true;
  }

  return false;
}

export async function createBooking(
  userId: string,
  classId: string,
  attendeeCount: number,
) {
  for (let attempt = 0; attempt < MAX_TRANSACTION_RETRIES; attempt++) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const now = new Date();

          const yogaClass = await tx.class.findUnique({
            where: {
              id: classId,
            },
          });

          if (!yogaClass) {
            throw new BookingError("Class not found.", 404);
          }

          if (yogaClass.startAt <= now) {
            throw new BookingError(
              "This class can no longer be booked.",
              400,
            );
          }

          const existingBooking = await tx.booking.findUnique({
            where: {
              userId_classId: {
                userId,
                classId,
              },
            },
          });

          if (existingBooking?.status === "CONFIRMED") {
            throw new BookingError(
              "You are already booked for this class.",
              409,
            );
          }

          const capacityResult = await tx.booking.aggregate({
            where: {
              classId,
              status: "CONFIRMED",
            },
            _sum: {
              attendeeCount: true,
            },
          });

          const currentAttendees =
            capacityResult._sum.attendeeCount ?? 0;

          if (
            currentAttendees + attendeeCount >
            yogaClass.capacity
          ) {
            throw new BookingError(
              "There are not enough spots available for this class.",
              409,
            );
          }

          const membership =
            await tx.membership.findFirst({
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

          const hasActiveMembership = Boolean(membership);

          const creditsRequired = calculateCreditsRequired(
            attendeeCount,
            hasActiveMembership,
          );

          const passes = await tx.classPass.findMany({
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

          let allocations;

          try {
            allocations = allocateCredits(
              passes,
              creditsRequired,
            );
          } catch (error) {
            if (
              error instanceof Error &&
              error.message === "Insufficient class-pass credits"
            ) {
              throw new BookingError(
                "You need an active membership or enough class-pass credits to book this class.",
                409,
              );
            }

            throw error;
          }

          for (const allocation of allocations) {
            const updatedPass =
              await tx.classPass.updateMany({
                where: {
                  id: allocation.classPassId,
                  remainingCredits: {
                    gte: allocation.creditsUsed,
                  },
                },
                data: {
                  remainingCredits: {
                    decrement: allocation.creditsUsed,
                  },
                },
              });

            if (updatedPass.count !== 1) {
              throw new BookingError(
                "Class-pass credits changed while booking. Please try again.",
                409,
              );
            }
          }

          const booking = existingBooking
            ? await tx.booking.update({
                where: {
                  id: existingBooking.id,
                },
                data: {
                  status: "CONFIRMED",
                  attendeeCount,
                },
              })
            : await tx.booking.create({
                data: {
                  userId,
                  classId,
                  attendeeCount,
                  status: "CONFIRMED",
                },
              });

          for (const allocation of allocations) {
            await tx.bookingCreditUsage.create({
              data: {
                bookingId: booking.id,
                classPassId: allocation.classPassId,
                creditsUsed: allocation.creditsUsed,
              },
            });
          }

          return {
            booking,
            creditsUsed: creditsRequired,
            membershipUsed: hasActiveMembership,
          };
        },
        {
          isolationLevel:
            Prisma.TransactionIsolationLevel.Serializable,
        },
      );
    } catch (error) {
      if (error instanceof BookingError) {
        throw error;
      }

      if (isTransactionConflict(error)) {
        if (attempt < MAX_TRANSACTION_RETRIES - 1) {
          continue;
        }

        throw new BookingError(
          "The booking could not be completed because another booking was processed at the same time. Please try again.",
          409,
        );
      }

      throw error;
    }
  }

  throw new BookingError(
    "Unable to create booking.",
    500,
  );
}

export async function cancelBooking(
  userId: string,
  bookingId: string,
) {
  for (let attempt = 0; attempt < MAX_TRANSACTION_RETRIES; attempt++) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const now = new Date();

          const booking = await tx.booking.findUnique({
            where: {
              id: bookingId,
            },
            include: {
              class: true,
              creditUsages: true,
            },
          });

          if (!booking) {
            throw new BookingError(
              "Booking not found.",
              404,
            );
          }

          if (booking.userId !== userId) {
            throw new BookingError(
              "You are not allowed to cancel this booking.",
              403,
            );
          }

          if (booking.status !== "CONFIRMED") {
            throw new BookingError(
              "Booking is already cancelled.",
              409,
            );
          }

          if (booking.class.startAt <= now) {
            throw new BookingError(
              "This booking can no longer be cancelled.",
              400,
            );
          }

          for (const usage of booking.creditUsages) {
            const updatedPass =
              await tx.classPass.updateMany({
                where: {
                  id: usage.classPassId,
                },
                data: {
                  remainingCredits: {
                    increment: usage.creditsUsed,
                  },
                },
              });

            if (updatedPass.count !== 1) {
              throw new BookingError(
                "Unable to restore class-pass credits.",
                409,
              );
            }
          }

          await tx.bookingCreditUsage.deleteMany({
            where: {
              bookingId: booking.id,
            },
          });

          const cancelledBooking =
            await tx.booking.update({
              where: {
                id: booking.id,
              },
              data: {
                status: "CANCELLED",
              },
            });

          return {
            booking: cancelledBooking,
            creditsRestored: booking.creditUsages.reduce(
              (total, usage) =>
                total + usage.creditsUsed,
              0,
            ),
          };
        },
        {
          isolationLevel:
            Prisma.TransactionIsolationLevel.Serializable,
        },
      );
    } catch (error) {
      if (error instanceof BookingError) {
        throw error;
      }

      if (isTransactionConflict(error)) {
        if (attempt < MAX_TRANSACTION_RETRIES - 1) {
          continue;
        }

        throw new BookingError(
          "The cancellation could not be completed because another booking change was processed at the same time. Please try again.",
          409,
        );
      }

      throw error;
    }
  }

  throw new BookingError(
    "Unable to cancel booking.",
    500,
  );
}