import { NextResponse } from "next/server";

import { requireUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const user = await requireUser();

    const body = await request.json();

    if (
      !body ||
      typeof body.productId !== "string" ||
      body.productId.length === 0
    ) {
      return NextResponse.json(
        { error: "A valid product is required." },
        { status: 400 },
      );
    }

    const product = await prisma.product.findFirst({
      where: {
        id: body.productId,
        active: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        productId: product.id,
        amountCents: product.priceCents,
        currency: product.currency,
        status: "PENDING",
      },
    });

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      customer_email: user.email ?? undefined,

      line_items: [
        {
          price_data: {
            currency: product.currency.toLowerCase(),
            product_data: {
              name: product.name,
              description: product.description ?? undefined,
            },
            unit_amount: product.priceCents,
          },
          quantity: 1,
        },
      ],

      metadata: {
        purchaseId: purchase.id,
        productId: product.id,
        userId: user.id,
      },

      payment_intent_data: {
        metadata: {
          purchaseId: purchase.id,
          productId: product.id,
          userId: user.id,
        },
      },

      success_url: `${appUrl}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/purchase/cancel`,

      client_reference_id: purchase.id,
    });

    await prisma.purchase.update({
      where: {
        id: purchase.id,
      },
      data: {
        stripeCheckoutSessionId: session.id,
      },
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHENTICATED"
    ) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    console.error("Create checkout session error:", error);

    return NextResponse.json(
      { error: "Unable to start checkout." },
      { status: 500 },
    );
  }
}