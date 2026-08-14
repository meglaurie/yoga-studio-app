import { NextResponse } from "next/server";

import { requireUser } from "@/lib/authorization";
import {
  BookingError,
  createBooking,
} from "@/lib/bookings";
import { createBookingSchema } from "@/lib/validation/booking";

export async function POST(request: Request) {
  try {
    const user = await requireUser();

    const body = await request.json();

    const result = createBookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid request.",
          issues: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const booking = await createBooking(
      user.id,
      result.data.classId,
      result.data.attendeeCount,
    );

    return NextResponse.json(
      {
        booking: {
          id: booking.booking.id,
          classId: booking.booking.classId,
          attendeeCount: booking.booking.attendeeCount,
          status: booking.booking.status,
        },
        creditsUsed: booking.creditsUsed,
        membershipUsed: booking.membershipUsed,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof BookingError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: error.status,
        },
      );
    }

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

    console.error("Create booking error:", error);

    return NextResponse.json(
      {
        error: "Unable to create booking.",
      },
      { status: 500 },
    );
  }
}