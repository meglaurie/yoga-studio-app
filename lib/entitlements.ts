import { prisma } from "@/lib/prisma";

export async function createEntitlementForPurchase(
  purchaseId: string,
) {
  return prisma.$transaction(async (tx) => {
    const purchase = await tx.purchase.findUnique({
      where: {
        id: purchaseId,
      },
      include: {
        product: true,
      },
    });

    if (!purchase) {
      throw new Error("Purchase not found");
    }

    if (purchase.status !== "PAID") {
      throw new Error("Purchase must be PAID before creating an entitlement");
    }

    const product = purchase.product;

    switch (product.type) {
      case "DROP_IN":
      case "CLASS_PASS": {
        if (!product.creditCount || product.creditCount <= 0) {
          throw new Error(
            "Credit-based product must have a positive creditCount",
          );
        }

        return tx.classPass.upsert({
          where: {
            purchaseId: purchase.id,
          },
          update: {},
          create: {
            userId: purchase.userId,
            purchaseId: purchase.id,
            totalCredits: product.creditCount,
            remainingCredits: product.creditCount,
            expiresAt: new Date(
              purchase.createdAt.getTime() +
                365 * 24 * 60 * 60 * 1000,
            ),
          },
        });
      }

      case "MONTHLY_MEMBERSHIP":
      case "ANNUAL_MEMBERSHIP": {
        const durationInDays =
          product.type === "MONTHLY_MEMBERSHIP" ? 30 : 365;

        return tx.membership.upsert({
          where: {
            purchaseId: purchase.id,
          },
          update: {},
          create: {
            userId: purchase.userId,
            purchaseId: purchase.id,
            startsAt: purchase.createdAt,
            expiresAt: new Date(
              purchase.createdAt.getTime() +
                durationInDays * 24 * 60 * 60 * 1000,
            ),
          },
        });
      }
    }
  });
}