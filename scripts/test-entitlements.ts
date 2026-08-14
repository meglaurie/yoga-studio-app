import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { createEntitlementForPurchase } from "../lib/entitlements";

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
  console.log("Testing entitlement creation...");

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

  if (classPassProduct.creditCount !== 10) {
    throw new Error(
      `Expected class pass to have 10 credits, got ${classPassProduct.creditCount}`,
    );
  }

  const classPassPurchase = await prisma.purchase.create({
    data: {
      userId: sarah.id,
      productId: classPassProduct.id,
      amountCents: classPassProduct.priceCents,
      currency: classPassProduct.currency,
      status: "PAID",
    },
  });

  const membershipPurchase = await prisma.purchase.create({
    data: {
      userId: james.id,
      productId: membershipProduct.id,
      amountCents: membershipProduct.priceCents,
      currency: membershipProduct.currency,
      status: "PAID",
    },
  });

  try {
    const classPass = await createEntitlementForPurchase(
      classPassPurchase.id,
    );

    const membership = await createEntitlementForPurchase(
      membershipPurchase.id,
    );

    if (!("totalCredits" in classPass)) {
      throw new Error("Expected class pass entitlement");
    }

    if (!("startsAt" in membership)) {
      throw new Error("Expected membership entitlement");
    }

    console.log("Class pass created:");
    console.log({
      userId: classPass.userId,
      purchaseId: classPass.purchaseId,
      totalCredits: classPass.totalCredits,
      remainingCredits: classPass.remainingCredits,
    });

    console.log("Membership created:");
    console.log({
      userId: membership.userId,
      purchaseId: membership.purchaseId,
      startsAt: membership.startsAt,
      expiresAt: membership.expiresAt,
    });

    const classPassAgain = await createEntitlementForPurchase(
      classPassPurchase.id,
    );

    const membershipAgain = await createEntitlementForPurchase(
      membershipPurchase.id,
    );

    if (classPassAgain.id !== classPass.id) {
      throw new Error(
        "Class pass entitlement was duplicated instead of reused",
      );
    }

    if (membershipAgain.id !== membership.id) {
      throw new Error(
        "Membership entitlement was duplicated instead of reused",
      );
    }

    const classPassCount = await prisma.classPass.count({
      where: {
        purchaseId: classPassPurchase.id,
      },
    });

    const membershipCount = await prisma.membership.count({
      where: {
        purchaseId: membershipPurchase.id,
      },
    });

    if (classPassCount !== 1) {
      throw new Error(
        `Expected exactly 1 ClassPass, found ${classPassCount}`,
      );
    }

    if (membershipCount !== 1) {
      throw new Error(
        `Expected exactly 1 Membership, found ${membershipCount}`,
      );
    }

    console.log("Idempotency check passed.");
    console.log("Entitlement creation test passed.");
  } finally {
    await prisma.classPass.deleteMany({
      where: {
        purchaseId: classPassPurchase.id,
      },
    });

    await prisma.membership.deleteMany({
      where: {
        purchaseId: membershipPurchase.id,
      },
    });

    await prisma.purchase.deleteMany({
      where: {
        id: {
          in: [classPassPurchase.id, membershipPurchase.id],
        },
      },
    });

    console.log("Temporary test data cleaned up.");
  }
}

main()
  .catch((error) => {
    console.error("Entitlement test failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });