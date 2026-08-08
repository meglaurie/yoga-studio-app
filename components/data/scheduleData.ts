export interface ScheduleClass {
  id: string;
  date: string;
  title: string;
  instructor: string;
  time: string;
  duration: string;
  capacity: number;
  booked: number;
}

export const scheduleData: ScheduleClass[] = [
  {
    id: 'beginner-flow-1',
    date: '2026-08-10',
    title: 'Beginner Flow',
    instructor: 'Sarah',
    time: '9:00 AM',
    duration: '60 min',
    capacity: 20,
    booked: 12,
  },
  {
    id: 'power-flow-1',
    date: '2026-08-10',
    title: 'Power Flow',
    instructor: 'Maya',
    time: '6:00 PM',
    duration: '60 min',
    capacity: 20,
    booked: 17,
  },
  {
    id: 'yin-yoga-1',
    date: '2026-08-10',
    title: 'Yin Yoga',
    instructor: 'Emma',
    time: '7:30 PM',
    duration: '75 min',
    capacity: 15,
    booked: 8,
  },

  {
    id: 'morning-flow-1',
    date: '2026-08-11',
    title: 'Morning Flow',
    instructor: 'Sarah',
    time: '9:00 AM',
    duration: '60 min',
    capacity: 20,
    booked: 9,
  },
  {
    id: 'slow-flow-1',
    date: '2026-08-11',
    title: 'Slow Flow',
    instructor: 'Emma',
    time: '5:30 PM',
    duration: '60 min',
    capacity: 18,
    booked: 14,
  },

  {
    id: 'power-flow-2',
    date: '2026-08-12',
    title: 'Power Flow',
    instructor: 'Maya',
    time: '6:00 PM',
    duration: '60 min',
    capacity: 20,
    booked: 20,
  },
];