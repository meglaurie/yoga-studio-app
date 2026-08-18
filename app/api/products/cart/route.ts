import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const cartSchema = z.object({
  productIds: z
    .array(z.string().min(1))
    .max(50),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = cartSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid product IDs." },
        { status: 400 },
      );
    }

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: result.data.productIds,
        },
        active: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        priceCents: true,
        currency: true,
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Failed to load cart products:", error);

    return NextResponse.json(
      { error: "Unable to load cart products." },
      { status: 500 },
    );
  }
}