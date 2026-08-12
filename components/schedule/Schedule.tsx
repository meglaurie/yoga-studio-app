'use client';

import Calendar from '@/components/schedule/Calendar';
import ScheduleTable from '@/components/schedule/ScheduleTable';
import type { YogaClass } from '@/types/class';

interface ScheduleProps {
  selectedDate: string;
  classes: YogaClass[];
  isAuthenticated: boolean;
}

export default function Schedule({
  selectedDate,
  classes,
  isAuthenticated
}: ScheduleProps) {
  return (
    <div>
      <Calendar
        selectedDate={selectedDate}
        onDateChange={(date) => {
          window.location.href = `/schedule?date=${date}`;
        }}
      />

      <ScheduleTable
        classes={classes}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}