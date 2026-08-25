import { NextResponse } from "next/server";

import { requireOwner } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { updateClassSchema } from "@/lib/validation/owner-class";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    await requireOwner();

    const { id } = await params;

    const existingClass = await prisma.class.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            bookings: {
              where: { status: "CONFIRMED" },
            },
          },
        },
      },
    });

    if (!existingClass) {
      return NextResponse.json(
        { error: "Class not found." },
        { status: 404 },
      );
    }

    const body = await request.json();
    const result = updateClassSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid class information.",
          issues: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const {
      name,
      description,
      instructorName,
      level,
      startAt,
      endAt,
      capacity,
    } = result.data;

    if (capacity < existingClass._count.bookings) {
      return NextResponse.json(
        {
          error: `Capacity cannot be less than the ${existingClass._count.bookings} confirmed booking(s) for this class.`,
        },
        { status: 400 },
      );
    }

    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        name,
        description: description || null,
        instructorName,
        level,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        capacity,
      },
    });

    return NextResponse.json({ class: updatedClass }, { status: 200 });
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

    console.error("Update owner class error:", error);

    return NextResponse.json(
      { error: "Unable to update class." },
      { status: 500 },
    );
  }
}