import { NextResponse } from "next/server";

import { requireOwner } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/lib/validation/owner-product";

export async function POST(request: Request) {
  try {
    await requireOwner();

    const body = await request.json();
    const result = createProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid product information.",
          issues: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { type, name, description, priceDollars, creditCount } =
      result.data;

    const product = await prisma.product.create({
      data: {
        type,
        name,
        description: description || null,
        priceCents: Math.round(priceDollars * 100),
        currency: "CAD",
        creditCount: creditCount ?? null,
        active: true,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHENTICATED") {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Owner access required." },
        { status: 403 },
      );
    }

    console.error("Create product error:", error);

    return NextResponse.json(
      { error: "Unable to create product." },
      { status: 500 },
    );
  }
}