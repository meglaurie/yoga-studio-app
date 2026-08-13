export interface YogaClass {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  name: string;
  instructor: string;
  level: string;
  capacity: number;
  booked: number;
  isBooked: boolean;
  bookingId: string | null;
}