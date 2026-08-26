import { NextResponse } from "next/server";

import { requireOwner } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { buildUpdateProductSchema } from "@/lib/validation/owner-product";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    await requireOwner();

    const { id } = await params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

    const body = await request.json();
    const schema = buildUpdateProductSchema(existingProduct.type);
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid product information.",
          issues: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { name, description, priceDollars, creditCount } = result.data;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description: description || null,
        priceCents: Math.round(priceDollars * 100),
        creditCount: creditCount ?? null,
      },
    });

    return NextResponse.json({ product: updatedProduct }, { status: 200 });
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

    console.error("Update product error:", error);

    return NextResponse.json(
      { error: "Unable to update product." },
      { status: 500 },
    );
  }
}

export async function PATCH(_request: Request, { params }: RouteContext) {
  try {
    await requireOwner();

    const { id } = await params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { active: !existingProduct.active },
    });

    return NextResponse.json({ product: updatedProduct }, { status: 200 });
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

    console.error("Toggle product active error:", error);

    return NextResponse.json(
      { error: "Unable to update product." },
      { status: 500 },
    );
  }
}