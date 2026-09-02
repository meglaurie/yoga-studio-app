import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { contactMessageSchema } from "@/lib/validation/contact";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactMessageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid message.",
          issues: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { name, email, message } = result.data;

    await prisma.contactMessage.create({
      data: { name, email, message },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Create contact message error:", error);

    return NextResponse.json(
      { error: "Unable to send message. Please try again." },
      { status: 500 },
    );
  }
}