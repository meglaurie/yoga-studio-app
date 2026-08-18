import { NextResponse } from "next/server";
import { z } from "zod";

import { requireUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const checkoutSchema = z.object({
  productIds: z
    .array(z.string().min(1))
    .min(1)
    .max(50),
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();

    const body = await request.json();
    const result = checkoutSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "At least one valid product is required.",
        },
        { status: 400 },
      );
    }

    // Remove duplicates even if a malicious/custom client sends them.
    const productIds = [...new Set(result.data.productIds)];

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
        active: true,
      },
    });

    // Every requested product must exist and still be active.
    if (products.length !== productIds.length) {
      return NextResponse.json(
        {
          error:
            "One or more products are unavailable. Please review your cart.",
        },
        { status: 400 },
      );
    }

    // Preserve the cart's order when creating the Stripe line items.
    const productsById = new Map(
      products.map((product) => [product.id, product]),
    );

    const orderedProducts = productIds.map(
      (productId) => productsById.get(productId)!,
    );

    // For this first version, all products in a checkout must use
    // the same currency because Stripe Checkout creates one session total.
    const currencies = new Set(
      orderedProducts.map((product) =>
        product.currency.toLowerCase(),
      ),
    );

    if (currencies.size !== 1) {
      return NextResponse.json(
        {
          error:
            "Products with different currencies cannot be purchased together.",
        },
        { status: 400 },
      );
    }

    const purchases = await prisma.$transaction(
      orderedProducts.map((product) =>
        prisma.purchase.create({
          data: {
            userId: user.id,
            productId: product.id,
            amountCents: product.priceCents,
            currency: product.currency,
            status: "PENDING",
          },
        }),
      ),
    );

    try {
      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ??
        "http://localhost:3000";

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: user.email ?? undefined,

        line_items: orderedProducts.map((product) => ({
          price_data: {
            currency: product.currency.toLowerCase(),
            product_data: {
              name: product.name,
              description: product.description ?? undefined,
            },
            unit_amount: product.priceCents,
          },
          quantity: 1,
        })),

        metadata: {
          purchaseIds: purchases.map((purchase) => purchase.id).join(","),
          userId: user.id,
        },

        payment_intent_data: {
          metadata: {
            purchaseIds: purchases
              .map((purchase) => purchase.id)
              .join(","),
            userId: user.id,
          },
        },

        success_url:
          `${appUrl}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url: `${appUrl}/purchase/cancel`,

        client_reference_id: purchases[0]?.id,
      });

      await prisma.purchase.updateMany({
        where: {
          id: {
            in: purchases.map((purchase) => purchase.id),
          },
        },
        data: {
          stripeCheckoutSessionId: session.id,
        },
      });

      return NextResponse.json({
        url: session.url,
      });
    } catch (stripeError) {
      console.error(
        "Stripe checkout session creation error:",
        stripeError,
      );

      await prisma.purchase.updateMany({
        where: {
          id: {
            in: purchases.map((purchase) => purchase.id),
          },
        },
        data: {
          status: "FAILED",
        },
      });

      return NextResponse.json(
        {
          error: "Unable to start checkout.",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHENTICATED"
    ) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        { status: 401 },
      );
    }

    console.error("Create checkout session error:", error);

    return NextResponse.json(
      {
        error: "Unable to start checkout.",
      },
      { status: 500 },
    );
  }
}