import { NextResponse } from 'next/server';

import { requireUser } from '@/lib/authorization';
import { prisma } from '@/lib/prisma';
import { createBookingSchema } from '@/lib/validation/booking';
import { Prisma } from '@/lib/generated/prisma/client';

const MAX_TRANSACTION_RETRIES = 3;

function isTransactionConflict(error: unknown) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2034'
  ) {
    return true;
  }

  const cause =
    typeof error === 'object' &&
    error !== null &&
    'cause' in error
      ? error.cause
      : null;

  if (
    typeof cause === 'object' &&
    cause !== null &&
    'originalCode' in cause &&
    cause.originalCode === '40001'
  ) {
    return true;
  }

  return false;
}


export async function POST(request: Request) {
  try {
    const user = await requireUser();

    const body = await request.json();

    const result = createBookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Invalid request.',
          issues: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { classId } = result.data;

    for (let attempt = 0; attempt < MAX_TRANSACTION_RETRIES; attempt++) {
      try {
        const booking = await prisma.$transaction(
          async (tx) => {
            const yogaClass = await tx.class.findUnique({
              where: {
                id: classId,
              },
              include: {
                _count: {
                  select: {
                    bookings: {
                      where: {
                        status: 'CONFIRMED',
                      },
                    },
                  },
                },
              },
            });

            if (!yogaClass) {
              throw new BookingError(
                'Class not found.',
                404,
              );
            }

            if (yogaClass.startAt <= new Date()) {
              throw new BookingError(
                'This class can no longer be booked.',
                400,
              );
            }

            const existingBooking = await tx.booking.findUnique({
              where: {
                userId_classId: {
                  userId: user.id,
                  classId,
                },
              },
            });

            if (existingBooking?.status === 'CONFIRMED') {
              throw new BookingError(
                'You are already booked for this class.',
                409,
              );
            }

            const confirmedBookings = yogaClass._count.bookings;

            if (confirmedBookings >= yogaClass.capacity) {
              throw new BookingError(
                'This class is full.',
                409,
              );
            }

            return existingBooking
              ? tx.booking.update({
                  where: {
                    id: existingBooking.id,
                  },
                  data: {
                    status: 'CONFIRMED',
                  },
                })
              : tx.booking.create({
                  data: {
                    userId: user.id,
                    classId,
                    status: 'CONFIRMED',
                  },
                });
          },
          {
            isolationLevel:
              Prisma.TransactionIsolationLevel.Serializable,
          },
        );

        return NextResponse.json(
          {
            booking: {
              id: booking.id,
              classId: booking.classId,
              status: booking.status,
            },
          },
          { status: 201 },
        );
      } catch (error) {
        if (error instanceof BookingError) {
          return NextResponse.json(
            {
              error: error.message,
            },
            { status: error.status },
          );
        }

       if (isTransactionConflict(error)) {
          if (attempt < MAX_TRANSACTION_RETRIES - 1) {
            continue;
          }

          return NextResponse.json(
            {
              error:
                'The booking could not be completed because another booking was processed at the same time. Please try again.',
            },
            { status: 409 },
          );
        }

        throw error;
      }
    }

    return NextResponse.json(
      {
        error: 'Unable to create booking.',
      },
      { status: 500 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHENTICATED') {
      return NextResponse.json(
        {
          error: 'Authentication required.',
        },
        { status: 401 },
      );
    }

    console.error('Create booking error:', error);

    return NextResponse.json(
      {
        error: 'Unable to create booking.',
      },
      { status: 500 },
    );
  }
}

class BookingError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'BookingError';
    this.status = status;
  }
}