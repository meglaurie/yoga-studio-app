import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth-server";
import {
  BookingError,
  cancelBooking,
} from "@/lib/bookings";

interface CancelBookingRouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  request: Request,
  { params }: CancelBookingRouteContext,
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Booking ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const result = await cancelBooking(
      user.id,
      id,
    );

    return NextResponse.json(
      {
        booking: {
          id: result.booking.id,
          classId: result.booking.classId,
          status: result.booking.status,
        },
        creditsRestored: result.creditsRestored,
      },
      {
        status: 200,
      },
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

    console.error(
      "Cancel booking error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to cancel booking.",
      },
      {
        status: 500,
      },
    );
  }
}