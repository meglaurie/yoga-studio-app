'use client';

import { useState } from 'react';

import {
  formatDateKey,
  getWeekDates,
} from '@/lib/dateUtils';

interface CalendarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function Calendar({
  selectedDate,
  onDateChange,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(
    new Date('2026-08-10'),
  );

  const dates = getWeekDates(currentDate);

  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  function handlePreviousWeek() {
    const previousWeek = new Date(currentDate);

    previousWeek.setDate(previousWeek.getDate() - 7);

    setCurrentDate(previousWeek);
  }

  function handleNextWeek() {
    const nextWeek = new Date(currentDate);

    nextWeek.setDate(nextWeek.getDate() + 7);

    setCurrentDate(nextWeek);
  }

  return (
    <section>
      <div>
        <button
          type="button"
          onClick={handlePreviousWeek}
          aria-label="Previous week"
        >
          ←
        </button>

        <h2>{monthName}</h2>

        <button
          type="button"
          onClick={handleNextWeek}
          aria-label="Next week"
        >
          →
        </button>
      </div>

      <div>
        {dates.map((date) => {
          const dateKey = formatDateKey(date);

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onDateChange(dateKey)}
              aria-pressed={selectedDate === dateKey}
            >
              <span>
                {date.toLocaleDateString('en-US', {
                  weekday: 'short',
                })}
              </span>

              <span>{date.getDate()}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}