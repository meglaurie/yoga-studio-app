import { formatDateForInput } from '@/lib/date';
import type { YogaClass } from '@/types/class';

interface PrismaClass {
  id: string;
  name: string;
  instructorName: string;
  level: string;
  startAt: Date;
  endAt: Date;
  capacity: number;
  bookings: {
    id: string;
    attendeeCount: number;
    userId: string;
  }[];
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function mapClassToYogaClass(
  yogaClass: PrismaClass,
  userId?: string,
): YogaClass {
  const confirmedBookings = yogaClass.bookings;

  const booked = confirmedBookings.reduce(
    (total, booking) => total + booking.attendeeCount,
    0,
  );

  const userBooking = userId
    ? confirmedBookings.find(
        (booking) => booking.userId === userId,
      )
    : undefined;

  return {
    id: yogaClass.id,
    date: formatDateForInput(yogaClass.startAt),
    startTime: formatTime(yogaClass.startAt),
    endTime: formatTime(yogaClass.endAt),
    name: yogaClass.name,
    instructor: yogaClass.instructorName,
    level: yogaClass.level,
    capacity: yogaClass.capacity,
    booked,
    isBooked: Boolean(userBooking),
    bookingId: userBooking?.id ?? null,
  };
}