import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-server';

interface CancelBookingRouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  request: Request,
  { params }: CancelBookingRouteContext,
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
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
        error: 'Booking ID is required',
      },
      {
        status: 400,
      },
    );
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id,
    },
  });

  if (!booking) {
    return NextResponse.json(
      {
        error: 'Booking not found',
      },
      {
        status: 404,
      },
    );
  }

  if (booking.userId !== user.id) {
    return NextResponse.json(
      {
        error: 'Forbidden',
      },
      {
        status: 403,
      },
    );
  }

  if (booking.status !== 'CONFIRMED') {
    return NextResponse.json(
      {
        error: 'Booking is not active',
      },
      {
        status: 409,
      },
    );
  }

  const updatedBooking = await prisma.booking.update({
    where: {
      id: booking.id,
    },
    data: {
      status: 'CANCELLED',
    },
  });

  return NextResponse.json(
    {
      booking: updatedBooking,
    },
    {
      status: 200,
    },
  );
}