import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { isTransactionConflict } from "@/lib/bookings";

const MAX_TRANSACTION_RETRIES = 3;

export class ClassCancellationError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ClassCancellationError";
    this.status = status;
  }
}

export async function cancelClass(classId: string) {
  for (let attempt = 0; attempt < MAX_TRANSACTION_RETRIES; attempt++) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const yogaClass = await tx.class.findUnique({
            where: { id: classId },
          });

          if (!yogaClass) {
            throw new ClassCancellationError("Class not found.", 404);
          }

          if (yogaClass.status === "CANCELLED") {
            throw new ClassCancellationError(
              "This class is already cancelled.",
              409,
            );
          }

          const confirmedBookings = await tx.booking.findMany({
            where: {
              classId,
              status: "CONFIRMED",
            },
            include: {
              creditUsages: true,
            },
          });

          for (const booking of confirmedBookings) {
            for (const usage of booking.creditUsages) {
              const updatedPass = await tx.classPass.updateMany({
                where: { id: usage.classPassId },
                data: {
                  remainingCredits: { increment: usage.creditsUsed },
                },
              });

              if (updatedPass.count !== 1) {
                throw new ClassCancellationError(
                  "Unable to restore class-pass credits.",
                  409,
                );
              }
            }

            await tx.bookingCreditUsage.deleteMany({
              where: { bookingId: booking.id },
            });

            await tx.booking.update({
              where: { id: booking.id },
              data: { status: "CANCELLED" },
            });

           const creditsRefunded = booking.creditUsages.reduce(
              (total, usage) => total + usage.creditsUsed,
              0,
            );

          const message =
            creditsRefunded > 0
              ? `Your booking for "${yogaClass.name}" on ${yogaClass.startAt.toLocaleDateString()} was cancelled by the studio. ${creditsRefunded} class-pass credit${creditsRefunded === 1 ? "" : "s"} used for your guest${creditsRefunded === 1 ? "" : "s"} ${creditsRefunded === 1 ? "has" : "have"} been refunded to your account.`
              : `Your booking for "${yogaClass.name}" on ${yogaClass.startAt.toLocaleDateString()} was cancelled by the studio. Please rebook if you'd like to attend a future class.`;

          await tx.notification.create({
            data: {
              userId: booking.userId,
              type: "CLASS_CANCELLED",
              message,
              classId: yogaClass.id,
            },
          });
          }

          const cancelledClass = await tx.class.update({
            where: { id: classId },
            data: { status: "CANCELLED" },
          });

          return {
            class: cancelledClass,
            bookingsCancelled: confirmedBookings.length,
          };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      if (error instanceof ClassCancellationError) {
        throw error;
      }
      if (isTransactionConflict(error)) {
        if (attempt < MAX_TRANSACTION_RETRIES - 1) {
          continue;
        }
        throw new ClassCancellationError(
          "The cancellation could not be completed because another change was processed at the same time. Please try again.",
          409,
        );
      }
      throw error;
    }
  }

  throw new ClassCancellationError("Unable to cancel class.", 500);
}