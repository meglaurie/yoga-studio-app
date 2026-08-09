'use client';

import { useState } from 'react';

import Calendar from '@/components/schedule/Calendar';
import ScheduleTable from '@/components/schedule/ScheduleTable';
import { classes } from '@/components/data/classes';
// import { classesForSelectedDate } from '@/components/data/scheduleData';

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState('2026-08-10');

  const classesForSelectedDate = classes.filter(
  (yogaClass) => yogaClass.date === selectedDate
  );
  return (
    <div>
      <Calendar
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <ScheduleTable
        classes={classesForSelectedDate}
        isAuthenticated={false}
      />
    </div>
  );
}