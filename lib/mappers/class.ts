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
  _count: {
    bookings: number;
  };
  bookings: {
    id: string;
  }[];
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function mapClassToYogaClass(
  yogaClass: PrismaClass
): YogaClass {
  return {
    id: yogaClass.id,
    date: formatDateForInput(yogaClass.startAt),
    startTime: formatTime(yogaClass.startAt),
    endTime: formatTime(yogaClass.endAt),
    name: yogaClass.name,
    instructor: yogaClass.instructorName,
    level: yogaClass.level,
    capacity: yogaClass.capacity,
    booked: yogaClass._count.bookings,
    isBooked: yogaClass.bookings.length > 0,
  };
}