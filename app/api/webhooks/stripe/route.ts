import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { createEntitlementForPurchase } from "@/lib/entitlements";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured.");

    return NextResponse.json(
      { error: "Webhook is not configured." },
      { status: 500 },
    );
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);

    return NextResponse.json(
      { error: "Invalid Stripe signature." },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        if (session.payment_status !== "paid") {
          console.log(
            `Checkout session ${session.id} completed but payment status is ${session.payment_status}.`,
          );

          break;
        }

        const purchases = await prisma.purchase.findMany({
          where: {
            stripeCheckoutSessionId: session.id,
          },
        });

        if (purchases.length === 0) {
          console.warn(
            `No purchases found for Stripe Checkout Session ${session.id}.`,
          );

          break;
        }

        for (const purchase of purchases) {
          if (purchase.status === "PAID") {
            continue;
          }

          const paidPurchase = await prisma.purchase.update({
            where: {
              id: purchase.id,
            },
            data: {
              status: "PAID",
              stripePaymentIntentId:
                typeof session.payment_intent === "string"
                  ? session.payment_intent
                  : null,
            },
          });

          await createEntitlementForPurchase(paidPurchase.id);
        }

        break;
      }

      default:
        console.log(
          `Ignoring unhandled Stripe event: ${event.type}`,
        );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing failed:", error);

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 },
    );
  }
}