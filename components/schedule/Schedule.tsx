'use client';

import { useState } from 'react';

import Calendar from '@/components/schedule/Calendar';
import ScheduleTable from '@/components/schedule/ScheduleTable';

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState('2026-08-10');

  return (
    <div>
      <Calendar
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <ScheduleTable selectedDate={selectedDate} />
    </div>
  );
}