import { NextResponse } from "next/server";

import { requireOwner } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { createClassSchema } from "@/lib/validation/owner-class";

export async function POST(request: Request) {
  try {
    const owner = await requireOwner();

    const body = await request.json();

    const result = createClassSchema.safeParse(body);

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

    const yogaClass = await prisma.class.create({
      data: {
        name,
        description: description || null,
        instructorName,
        level,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        capacity,
        createdById: owner.id,
      },
    });

    return NextResponse.json(
      {
        class: yogaClass,
      },
      { status: 201 },
    );
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

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        {
          error: "Owner access required.",
        },
        { status: 403 },
      );
    }

    console.error("Create owner class error:", error);

    return NextResponse.json(
      {
        error: "Unable to create class.",
      },
      { status: 500 },
    );
  }
}