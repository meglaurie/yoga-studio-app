import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import {
  BookingError,
  cancelBooking,
  createBooking,
} from "../lib/bookings";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function deleteBooking(
  bookingId: string,
) {
  await prisma.bookingCreditUsage.deleteMany({
    where: {
      bookingId,
    },
  });

  await prisma.booking.delete({
    where: {
      id: bookingId,
    },
  });
}

async function main() {
  console.log("Testing booking cancellation...");

  const [sarah, james, classPassProduct, membershipProduct] =
    await Promise.all([
      prisma.user.findUniqueOrThrow({
        where: {
          email: "sarah@stillwateryoga.test",
        },
      }),

      prisma.user.findUniqueOrThrow({
        where: {
          email: "james@stillwateryoga.test",
        },
      }),

      prisma.product.findUniqueOrThrow({
        where: {
          id: "ten-class-pass",
        },
      }),

      prisma.product.findUniqueOrThrow({
        where: {
          id: "annual-membership",
        },
      }),
    ]);

  const classes = await prisma.class.findMany({
    where: {
      startAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      startAt: "asc",
    },
    take: 5,
  });

  if (classes.length < 5) {
    throw new Error(
      "Expected at least 5 future classes. Run the database seed first.",
    );
  }

  const [
    normalClass,
    multiPassClass,
    membershipClass,
    rebookingClass,
    unauthorizedClass,
  ] = classes;

  const createdPurchases: string[] = [];
  const createdMemberships: string[] = [];
  const createdPasses: string[] = [];
  const createdBookings: string[] = [];

  try {
    /*
     * Test 1:
     * A normal credit-based booking restores exactly
     * the credits that were consumed.
     */
    const normalPurchase = await prisma.purchase.create({
      data: {
        userId: sarah.id,
        productId: classPassProduct.id,
        amountCents: classPassProduct.priceCents,
        currency: classPassProduct.currency,
        status: "PAID",
      },
    });

    createdPurchases.push(normalPurchase.id);

    const normalPass = await prisma.classPass.create({
      data: {
        userId: sarah.id,
        purchaseId: normalPurchase.id,
        totalCredits: 10,
        remainingCredits: 10,
        expiresAt: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000,
        ),
      },
    });

    createdPasses.push(normalPass.id);

    const normalBooking = await createBooking(
      sarah.id,
      normalClass.id,
      1,
    );

    createdBookings.push(normalBooking.booking.id);

    const passAfterBooking =
      await prisma.classPass.findUniqueOrThrow({
        where: {
          id: normalPass.id,
        },
      });

    if (passAfterBooking.remainingCredits !== 9) {
      throw new Error(
        `Expected 9 credits after booking, got ${passAfterBooking.remainingCredits}`,
      );
    }

    const normalCancellation = await cancelBooking(
      sarah.id,
      normalBooking.booking.id,
    );

    if (
      normalCancellation.booking.status !==
      "CANCELLED"
    ) {
      throw new Error(
        "Expected booking to be cancelled.",
      );
    }

    if (normalCancellation.creditsRestored !== 1) {
      throw new Error(
        `Expected 1 restored credit, got ${normalCancellation.creditsRestored}`,
      );
    }

    const passAfterCancellation =
      await prisma.classPass.findUniqueOrThrow({
        where: {
          id: normalPass.id,
        },
      });

    if (passAfterCancellation.remainingCredits !== 10) {
      throw new Error(
        `Expected 10 restored credits, got ${passAfterCancellation.remainingCredits}`,
      );
    }

    const usageAfterCancellation =
      await prisma.bookingCreditUsage.count({
        where: {
          bookingId: normalBooking.booking.id,
        },
      });

    if (usageAfterCancellation !== 0) {
      throw new Error(
        `Expected 0 usage records after cancellation, got ${usageAfterCancellation}`,
      );
    }

    console.log(
      "✓ Normal credit booking restored exactly 1 credit.",
    );

    await prisma.classPass.update({
        where: {
            id: normalPass.id,
        },
        data: {
            expiresAt: new Date(
            Date.now() - 60 * 1000,
            ),
        },
    });

    /*
     * Test 2:
     * Credits can be consumed from multiple class passes.
     *
     * Pass A = 1 credit
     * Pass B = 5 credits
     * Booking = 3 attendees
     *
     * The booking requires 3 credits, so allocation should be:
     *
     * Pass A = 1
     * Pass B = 2
     *
     * Cancellation must restore exactly those amounts.
     */
    const multiPassPurchaseA =
      await prisma.purchase.create({
        data: {
          userId: sarah.id,
          productId: classPassProduct.id,
          amountCents: classPassProduct.priceCents,
          currency: classPassProduct.currency,
          status: "PAID",
        },
      });

    createdPurchases.push(multiPassPurchaseA.id);

    const multiPassA = await prisma.classPass.create({
      data: {
        userId: sarah.id,
        purchaseId: multiPassPurchaseA.id,
        totalCredits: 1,
        remainingCredits: 1,
        expiresAt: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000,
        ),
      },
    });

    createdPasses.push(multiPassA.id);

    const multiPassPurchaseB =
      await prisma.purchase.create({
        data: {
          userId: sarah.id,
          productId: classPassProduct.id,
          amountCents: classPassProduct.priceCents,
          currency: classPassProduct.currency,
          status: "PAID",
        },
      });

    createdPurchases.push(multiPassPurchaseB.id);

    const multiPassB = await prisma.classPass.create({
      data: {
        userId: sarah.id,
        purchaseId: multiPassPurchaseB.id,
        totalCredits: 5,
        remainingCredits: 5,
        expiresAt: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000,
        ),
      },
    });

    createdPasses.push(multiPassB.id);

    const multiPassBooking = await createBooking(
      sarah.id,
      multiPassClass.id,
      3,
    );

    createdBookings.push(multiPassBooking.booking.id);

    if (multiPassBooking.creditsUsed !== 3) {
      throw new Error(
        `Expected 3 credits used, got ${multiPassBooking.creditsUsed}`,
      );
    }

    const usagesBeforeCancellation =
      await prisma.bookingCreditUsage.findMany({
        where: {
          bookingId: multiPassBooking.booking.id,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

    if (usagesBeforeCancellation.length !== 2) {
      throw new Error(
        `Expected 2 usage records, got ${usagesBeforeCancellation.length}`,
      );
    }

    const usageA = usagesBeforeCancellation.find(
      (usage) => usage.classPassId === multiPassA.id,
    );

    const usageB = usagesBeforeCancellation.find(
      (usage) => usage.classPassId === multiPassB.id,
    );

    if (!usageA || usageA.creditsUsed !== 1) {
      throw new Error(
        `Expected Pass A to consume 1 credit.`,
      );
    }

    if (!usageB || usageB.creditsUsed !== 2) {
      throw new Error(
        `Expected Pass B to consume 2 credits.`,
      );
    }

    const multiPassCancellation =
      await cancelBooking(
        sarah.id,
        multiPassBooking.booking.id,
      );

    if (
      multiPassCancellation.creditsRestored !== 3
    ) {
      throw new Error(
        `Expected 3 restored credits, got ${multiPassCancellation.creditsRestored}`,
      );
    }

    const restoredPassA =
      await prisma.classPass.findUniqueOrThrow({
        where: {
          id: multiPassA.id,
        },
      });

    const restoredPassB =
      await prisma.classPass.findUniqueOrThrow({
        where: {
          id: multiPassB.id,
        },
      });

    if (restoredPassA.remainingCredits !== 1) {
      throw new Error(
        `Expected Pass A to have 1 credit restored, got ${restoredPassA.remainingCredits}`,
      );
    }

    if (restoredPassB.remainingCredits !== 5) {
      throw new Error(
        `Expected Pass B to have 5 credits restored, got ${restoredPassB.remainingCredits}`,
      );
    }

    console.log(
      "✓ Multiple class passes restored exact historical allocations.",
    );

    await prisma.classPass.updateMany({
        where: {
            id: {
            in: [multiPassA.id, multiPassB.id],
            },
        },
        data: {
            expiresAt: new Date(
            Date.now() - 60 * 1000,
            ),
        },
    });

    /*
     * Test 3:
     * Membership bookings consume no class-pass credits.
     * Cancellation should restore nothing.
     */
    const membershipPurchase =
      await prisma.purchase.create({
        data: {
          userId: james.id,
          productId: membershipProduct.id,
          amountCents: membershipProduct.priceCents,
          currency: membershipProduct.currency,
          status: "PAID",
        },
      });

    createdPurchases.push(membershipPurchase.id);

    const membership =
      await prisma.membership.create({
        data: {
          userId: james.id,
          purchaseId: membershipPurchase.id,
          startsAt: new Date(
            Date.now() - 60 * 1000,
          ),
          expiresAt: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000,
          ),
        },
      });

    createdMemberships.push(membership.id);

    const membershipBooking =
      await createBooking(
        james.id,
        membershipClass.id,
        1,
      );

    createdBookings.push(membershipBooking.booking.id);

    if (membershipBooking.creditsUsed !== 0) {
      throw new Error(
        `Expected membership booking to use 0 credits, got ${membershipBooking.creditsUsed}`,
      );
    }

    const membershipCancellation =
      await cancelBooking(
        james.id,
        membershipBooking.booking.id,
      );

    if (
      membershipCancellation.creditsRestored !== 0
    ) {
      throw new Error(
        `Expected 0 restored credits, got ${membershipCancellation.creditsRestored}`,
      );
    }

    console.log(
      "✓ Membership booking cancelled with 0 credits restored.",
    );

    /*
     * Test 4:
     * A booking cannot be cancelled after the class starts.
     *
     * Create a temporary class in the past.
     */
    const pastClass = await prisma.class.create({
      data: {
        name: "Cancellation Test - Past Class",
        description: "Temporary cancellation test class.",
        instructorName: "Test Instructor",
        level: "ALL_LEVELS",
        startAt: new Date(
          Date.now() - 60 * 60 * 1000,
        ),
        endAt: new Date(
          Date.now() - 30 * 60 * 1000,
        ),
        capacity: 20,
        createdById: sarah.id,
      },
    });

    const pastPurchase = await prisma.purchase.create({
      data: {
        userId: sarah.id,
        productId: classPassProduct.id,
        amountCents: classPassProduct.priceCents,
        currency: classPassProduct.currency,
        status: "PAID",
      },
    });

    createdPurchases.push(pastPurchase.id);

    const pastPass = await prisma.classPass.create({
      data: {
        userId: sarah.id,
        purchaseId: pastPurchase.id,
        totalCredits: 10,
        remainingCredits: 10,
        expiresAt: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000,
        ),
      },
    });

    createdPasses.push(pastPass.id);

    /*
     * createBooking() intentionally rejects past classes,
     * so create this booking directly for the cancellation test.
     */
    const pastBooking = await prisma.booking.create({
      data: {
        userId: sarah.id,
        classId: pastClass.id,
        attendeeCount: 1,
        status: "CONFIRMED",
      },
    });

    createdBookings.push(pastBooking.id);

    try {
      await cancelBooking(
        sarah.id,
        pastBooking.id,
      );

      throw new Error(
        "Cancellation after class start unexpectedly succeeded.",
      );
    } catch (error) {
      if (!(error instanceof BookingError)) {
        throw error;
      }

      if (error.status !== 400) {
        throw new Error(
          `Expected status 400, got ${error.status}`,
        );
      }
    }

    const pastBookingAfter =
      await prisma.booking.findUniqueOrThrow({
        where: {
          id: pastBooking.id,
        },
      });

    if (pastBookingAfter.status !== "CONFIRMED") {
      throw new Error(
        "Past booking should remain confirmed after rejected cancellation.",
      );
    }

    console.log(
      "✓ Cancellation after class start rejected.",
    );

    /*
     * Test 5:
     * Already-cancelled bookings cannot be cancelled twice.
     */
    try {
      await cancelBooking(
        sarah.id,
        normalBooking.booking.id,
      );

      throw new Error(
        "Double cancellation unexpectedly succeeded.",
      );
    } catch (error) {
      if (!(error instanceof BookingError)) {
        throw error;
      }

      if (error.status !== 409) {
        throw new Error(
          `Expected double cancellation status 409, got ${error.status}`,
        );
      }
    }

    console.log(
      "✓ Already-cancelled booking rejected.",
    );

    /*
     * Test 6:
     * A different user cannot cancel someone else's booking.
     */
    const unauthorizedPurchase =
      await prisma.purchase.create({
        data: {
          userId: sarah.id,
          productId: classPassProduct.id,
          amountCents: classPassProduct.priceCents,
          currency: classPassProduct.currency,
          status: "PAID",
        },
      });

    createdPurchases.push(
      unauthorizedPurchase.id,
    );

    const unauthorizedPass =
      await prisma.classPass.create({
        data: {
          userId: sarah.id,
          purchaseId: unauthorizedPurchase.id,
          totalCredits: 10,
          remainingCredits: 10,
          expiresAt: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000,
          ),
        },
      });

    createdPasses.push(unauthorizedPass.id);

    const unauthorizedBooking =
      await createBooking(
        sarah.id,
        unauthorizedClass.id,
        1,
      );

    createdBookings.push(
      unauthorizedBooking.booking.id,
    );

    try {
      await cancelBooking(
        james.id,
        unauthorizedBooking.booking.id,
      );

      throw new Error(
        "Unauthorized cancellation unexpectedly succeeded.",
      );
    } catch (error) {
      if (!(error instanceof BookingError)) {
        throw error;
      }

      if (error.status !== 403) {
        throw new Error(
          `Expected unauthorized cancellation status 403, got ${error.status}`,
        );
      }
    }

    const unauthorizedBookingAfter =
      await prisma.booking.findUniqueOrThrow({
        where: {
          id: unauthorizedBooking.booking.id,
        },
      });

    if (
      unauthorizedBookingAfter.status !==
      "CONFIRMED"
    ) {
      throw new Error(
        "Unauthorized cancellation changed booking status.",
      );
    }

    console.log(
      "✓ Unauthorized cancellation rejected.",
    );

    await prisma.classPass.update({
        where: {
            id: unauthorizedPass.id,
        },
        data: {
            expiresAt: new Date(
            Date.now() - 60 * 1000,
            ),
        },
    });

    

    /*
     * Test 7:
     * After cancellation, the same user can book the same
     * class again. The reactivated booking should consume
     * fresh credits and create fresh usage records.
     */
    const rebookingPurchase =
      await prisma.purchase.create({
        data: {
          userId: sarah.id,
          productId: classPassProduct.id,
          amountCents: classPassProduct.priceCents,
          currency: classPassProduct.currency,
          status: "PAID",
        },
      });

    createdPurchases.push(rebookingPurchase.id);

    const rebookingPass =
    await prisma.classPass.create({
        data: {
        userId: sarah.id,
        purchaseId: rebookingPurchase.id,
        totalCredits: 10,
        remainingCredits: 10,
        expiresAt: new Date(
            Date.now() + 24 * 60 * 60 * 1000,
        ),
        },
    });

    createdPasses.push(rebookingPass.id);

    const firstRebooking =
      await createBooking(
        sarah.id,
        rebookingClass.id,
        1,
      );

    createdBookings.push(
      firstRebooking.booking.id,
    );

    const firstRebookingUsageCount =
      await prisma.bookingCreditUsage.count({
        where: {
          bookingId: firstRebooking.booking.id,
        },
      });

    if (firstRebookingUsageCount !== 1) {
      throw new Error(
        `Expected 1 usage record before rebooking cancellation, got ${firstRebookingUsageCount}`,
      );
    }

    await cancelBooking(
      sarah.id,
      firstRebooking.booking.id,
    );

    const rebookingPassAfterCancellation =
      await prisma.classPass.findUniqueOrThrow({
        where: {
          id: rebookingPass.id,
        },
      });

    if (
      rebookingPassAfterCancellation.remainingCredits !==
      10
    ) {
      throw new Error(
        `Expected 10 credits after cancellation, got ${rebookingPassAfterCancellation.remainingCredits}`,
      );
    }

    const secondBooking =
      await createBooking(
        sarah.id,
        rebookingClass.id,
        1,
      );

    if (
      secondBooking.booking.id !==
      firstRebooking.booking.id
    ) {
      throw new Error(
        "Expected cancelled booking to be reactivated rather than creating a duplicate booking.",
      );
    }

    if (secondBooking.creditsUsed !== 1) {
      throw new Error(
        `Expected rebooking to consume 1 credit, got ${secondBooking.creditsUsed}`,
      );
    }

    const rebookingPassAfterRebooking =
      await prisma.classPass.findUniqueOrThrow({
        where: {
          id: rebookingPass.id,
        },
      });

    if (
      rebookingPassAfterRebooking.remainingCredits !==
      9
    ) {
      throw new Error(
        `Expected 9 credits after rebooking, got ${rebookingPassAfterRebooking.remainingCredits}`,
      );
    }

    const secondUsage =
      await prisma.bookingCreditUsage.findMany({
        where: {
          bookingId: secondBooking.booking.id,
        },
      });

    if (
      secondUsage.length !== 1 ||
      secondUsage[0].creditsUsed !== 1 ||
      secondUsage[0].classPassId !== rebookingPass.id
    ) {
      throw new Error(
        "Rebooking did not create the expected fresh credit usage record.",
      );
    }

    console.log(
      "✓ Cancelled booking can be rebooked with fresh credit usage.",
    );

    /*
     * The past test class is not part of the normal seed data,
     * so clean it up after its booking has been removed.
     */
    await deleteBooking(pastBooking.id);

    await prisma.class.delete({
      where: {
        id: pastClass.id,
      },
    });

    console.log(
      "All booking cancellation tests passed.",
    );
  } finally {
    /*
     * Delete all temporary bookings and their usage records.
     */
    for (const bookingId of createdBookings) {
      const bookingExists =
        await prisma.booking.findUnique({
          where: {
            id: bookingId,
          },
        });

      if (bookingExists) {
        await prisma.bookingCreditUsage.deleteMany({
          where: {
            bookingId,
          },
        });

        await prisma.booking.delete({
          where: {
            id: bookingId,
          },
        });
      }
    }

    /*
     * Delete memberships before their purchases.
     */
    for (const membershipId of createdMemberships) {
      await prisma.membership.deleteMany({
        where: {
          id: membershipId,
        },
      });
    }

    /*
     * Delete class passes before their purchases.
     */
    for (const passId of createdPasses) {
      await prisma.classPass.deleteMany({
        where: {
          id: passId,
        },
      });
    }

    /*
     * Finally delete temporary purchases.
     */
    for (const purchaseId of createdPurchases) {
      await prisma.purchase.deleteMany({
        where: {
          id: purchaseId,
        },
      });
    }

    /*
     * Clean up the temporary past class if the test
     * failed before reaching its normal cleanup.
     */
    await prisma.class.deleteMany({
      where: {
        name: "Cancellation Test - Past Class",
      },
    });

    console.log("Temporary cancellation test data cleaned up.");
  }
}

main()
  .catch((error) => {
    console.error(
      "Booking cancellation test failed:",
      error,
    );
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });