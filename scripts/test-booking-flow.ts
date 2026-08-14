import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { createBooking, BookingError } from "../lib/bookings";

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


async function main() {
  console.log("Testing booking flow...");

  const [sarah, james, classPassProduct, yogaClass] =
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

      prisma.class.findFirstOrThrow({
        where: {
          startAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          startAt: "asc",
        },
      }),
    ]);

  /*
   * Clean up any previous test bookings/pass data for these users.
   */
  await prisma.bookingCreditUsage.deleteMany({
    where: {
      booking: {
        userId: {
          in: [sarah.id, james.id],
        },
        classId: yogaClass.id,
      },
    },
  });

  await prisma.booking.deleteMany({
    where: {
      userId: {
        in: [sarah.id, james.id],
      },
      classId: yogaClass.id,
    },
  });

  await prisma.classPass.deleteMany({
    where: {
      userId: sarah.id,
      purchase: {
        id: {
          not: "",
        },
      },
    },
  });

  /*
   * Create a temporary paid class-pass purchase.
   */
  const purchase = await prisma.purchase.create({
    data: {
      userId: sarah.id,
      productId: classPassProduct.id,
      amountCents: classPassProduct.priceCents,
      currency: classPassProduct.currency,
      status: "PAID",
    },
  });

  const classPass = await prisma.classPass.create({
    data: {
      userId: sarah.id,
      purchaseId: purchase.id,
      totalCredits: 10,
      remainingCredits: 10,
      expiresAt: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000,
      ),
    },
  });

  try {
    /*
     * Test 1: normal one-person booking.
     */
    const firstBooking = await createBooking(
      sarah.id,
      yogaClass.id,
      1,
    );

    if (firstBooking.creditsUsed !== 1) {
      throw new Error(
        `Expected 1 credit used, got ${firstBooking.creditsUsed}`,
      );
    }

    const passAfterFirstBooking =
      await prisma.classPass.findUniqueOrThrow({
        where: {
          id: classPass.id,
        },
      });

    if (passAfterFirstBooking.remainingCredits !== 9) {
      throw new Error(
        `Expected 9 remaining credits, got ${passAfterFirstBooking.remainingCredits}`,
      );
    }

    const usageCount =
      await prisma.bookingCreditUsage.count({
        where: {
          bookingId: firstBooking.booking.id,
        },
      });

    if (usageCount !== 1) {
      throw new Error(
        `Expected 1 credit usage record, got ${usageCount}`,
      );
    }

    console.log("✓ Basic booking consumed 1 credit.");

    /*
     * Test 2: duplicate booking should fail.
     */
    try {
      await createBooking(
        sarah.id,
        yogaClass.id,
        1,
      );

      throw new Error(
        "Duplicate booking unexpectedly succeeded",
      );
    } catch (error) {
      if (!(error instanceof BookingError)) {
        throw error;
      }

      if (error.status !== 409) {
        throw new Error(
          `Expected duplicate booking status 409, got ${error.status}`,
        );
      }
    }

    console.log("✓ Duplicate booking rejected.");

    /*
     * Test 3: membership booking.
     *
     * Create a temporary annual membership for James.
     */
    const membershipProduct =
      await prisma.product.findUniqueOrThrow({
        where: {
          id: "annual-membership",
        },
      });

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

    const membership =
      await prisma.membership.create({
        data: {
          userId: james.id,
          purchaseId: membershipPurchase.id,
          startsAt: new Date(
            Date.now() - 60 * 1000,
          ),
          expiresAt: new Date(
            Date.now() +
              365 * 24 * 60 * 60 * 1000,
          ),
        },
      });

    try {
      const membershipBooking =
        await createBooking(
          james.id,
          yogaClass.id,
          1,
        );

      if (membershipBooking.creditsUsed !== 0) {
        throw new Error(
          `Expected membership booking to use 0 credits, got ${membershipBooking.creditsUsed}`,
        );
      }

      console.log(
        "✓ Active membership booking used 0 credits.",
      );
    } finally {
        await prisma.bookingCreditUsage.deleteMany({
            where: {
            booking: {
                userId: james.id,
                classId: yogaClass.id,
            },
            },
        });

        await prisma.booking.deleteMany({
            where: {
            userId: james.id,
            classId: yogaClass.id,
            },
        });

        await prisma.membership.delete({
            where: {
            id: membership.id,
            },
        });

        await prisma.purchase.delete({
            where: {
            id: membershipPurchase.id,
            },
        });
    }
  } finally {
    /*
     * Clean up all temporary test data.
     */
    await prisma.bookingCreditUsage.deleteMany({
      where: {
        booking: {
          userId: sarah.id,
          classId: yogaClass.id,
        },
      },
    });

    await prisma.booking.deleteMany({
      where: {
        userId: sarah.id,
        classId: yogaClass.id,
      },
    });

    await prisma.classPass.delete({
      where: {
        id: classPass.id,
      },
    });

    await prisma.purchase.delete({
      where: {
        id: purchase.id,
      },
    });

    console.log("Temporary test data cleaned up.");
  }
}

main()
  .catch((error) => {
    console.error("Booking flow test failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

  