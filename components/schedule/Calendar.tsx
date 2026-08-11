'use client';

import { useMemo, useState } from 'react';

interface CalendarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const DAYS_TO_SHOW = 14;

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);

  return new Date(year, month - 1, day);
}

function getDays(startDate: Date): Date[] {
  return Array.from({ length: DAYS_TO_SHOW }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    return date;
  });
}

function getWeekStart(date: Date): Date {
  const day = date.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  const monday = new Date(date);
  monday.setDate(date.getDate() + difference);

  return monday;
}

export default function Calendar({
  selectedDate,
  onDateChange,
}: CalendarProps) {
  const [startDate, setStartDate] = useState(() => {
    return getWeekStart(parseDate(selectedDate));
  });

  const days = useMemo(() => getDays(startDate), [startDate]);

  const monthLabel = startDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  function goToPreviousPeriod() {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() - DAYS_TO_SHOW);

    setStartDate(newStartDate);
  }

  function goToNextPeriod() {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() + DAYS_TO_SHOW);

    setStartDate(newStartDate);
  }

  return (
    <section className="calendar">
      <div className="calendar__header">
        <button
          type="button"
          className="calendar__navigation"
          onClick={goToPreviousPeriod}
          aria-label="Previous two weeks"
        >
          ←
        </button>

        <h2 className="calendar__month">{monthLabel}</h2>

        <button
          type="button"
          className="calendar__navigation"
          onClick={goToNextPeriod}
          aria-label="Next two weeks"
        >
          →
        </button>
      </div>

      <div className="calendar__days">
        {days.map((date) => {
          const dateString = formatDate(date);
          const isSelected = dateString === selectedDate;

          const dayName = date.toLocaleDateString('en-US', {
            weekday: 'short',
          });

          const dayNumber = date.toLocaleDateString('en-US', {
            day: 'numeric',
          });

          const month = date.toLocaleDateString('en-US', {
            month: 'short',
          });

          return (
            <button
              key={dateString}
              type="button"
              className={`calendar__day ${
                isSelected ? 'calendar__day--selected' : ''
              }`}
              onClick={() => onDateChange(dateString)}
              aria-pressed={isSelected}
            >
              <span className="calendar__day-name">
                {dayName}
              </span>

              <span className="calendar__day-number">
                {dayNumber}
              </span>

              <span className="calendar__day-month">
                {month}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}