import { NextResponse } from "next/server";

import { requireOwner } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  request: Request,
  { params }: RouteContext,
) {
  try {
    await requireOwner();

    const { id } = await params;
    const body = await request.json();

    const {
      name,
      description,
      instructorName,
      level,
      startAt,
      endAt,
      capacity,
    } = body;

    if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof instructorName !== "string" ||
        !instructorName.trim() ||
        typeof level !== "string" ||
        typeof startAt !== "string" ||
        typeof endAt !== "string" ||
        typeof capacity !== "number" ||
        !Number.isInteger(capacity) ||
        capacity < 1
    ) {
      return NextResponse.json(
        { error: "Invalid class data." },
        { status: 400 },
      );
    }

    const validLevels = [
    "BEGINNER",
    "ALL_LEVELS",
    "INTERMEDIATE",
    "ADVANCED",
    ] as const;

    if (!validLevels.includes(level as (typeof validLevels)[number])) {
        return NextResponse.json(
            {
            error: "Invalid class level.",
            },
            { status: 400 },
        );
    }

    const parsedStartAt = new Date(startAt);
    const parsedEndAt = new Date(endAt);

    if (
      Number.isNaN(parsedStartAt.getTime()) ||
      Number.isNaN(parsedEndAt.getTime()) ||
      parsedEndAt <= parsedStartAt
    ) {
      return NextResponse.json(
        { error: "Invalid class times." },
        { status: 400 },
      );
    }

    const existingClass = await prisma.class.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            bookings: {
              where: {
                status: "CONFIRMED",
              },
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

    if (capacity < existingClass._count.bookings) {
      return NextResponse.json(
        {
          error: `Capacity cannot be lower than the current number of confirmed bookings (${existingClass._count.bookings}).`,
        },
        { status: 400 },
      );
    }

    const updatedClass = await prisma.class.update({
      where: {
        id,
      },
      data: {
        name: name.trim(),
        description:
          typeof description === "string" && description.trim()
            ? description.trim()
            : null,
        instructorName: instructorName.trim(),
        level: level as "BEGINNER" | "ALL_LEVELS" | "INTERMEDIATE" | "ADVANCED",
        startAt: parsedStartAt,
        endAt: parsedEndAt,
        capacity,
      },
    });

    return NextResponse.json({
      class: updatedClass,
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

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        { error: "Forbidden." },
        { status: 403 },
      );
    }

    console.error("Update class error:", error);

    return NextResponse.json(
      { error: "Unable to update class." },
      { status: 500 },
    );
  }
}