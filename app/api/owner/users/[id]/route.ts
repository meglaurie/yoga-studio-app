import { NextResponse } from "next/server";

import { requireOwner } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { updateUserSchema } from "@/lib/validation/owner-user";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    await requireOwner();

    const { id } = await params;

    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const body = await request.json();
    const result = updateUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid user information.",
          issues: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name: result.data.name },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
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

    console.error("Update user error:", error);

    return NextResponse.json(
      { error: "Unable to update user." },
      { status: 500 },
    );
  }
}

export async function PATCH(_request: Request, { params }: RouteContext) {
  try {
    await requireOwner();

    const { id } = await params;

    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Safeguard: only MEMBER accounts can be deactivated here. This also
    // means an owner can never deactivate themselves or another owner
    // through this endpoint — role changes are out of scope for MVP.
    if (existingUser.role !== "MEMBER") {
      return NextResponse.json(
        { error: "Only member accounts can be deactivated." },
        { status: 403 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        status: existingUser.status === "ACTIVE" ? "DEACTIVATED" : "ACTIVE",
      },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
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

    console.error("Toggle user status error:", error);

    return NextResponse.json(
      { error: "Unable to update user." },
      { status: 500 },
    );
  }
}