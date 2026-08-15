'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';

interface BookingButtonProps {
  classId: string;
  isBooked: boolean;
  bookingId: string | null;
  spotsRemaining: number;
}

export default function BookingButton({
  classId,
  isBooked,
  bookingId,
  spotsRemaining,
}: BookingButtonProps) {
  const router = useRouter();

  const [attendeeCount, setAttendeeCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBook() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId,
          attendeeCount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'Unable to book this class.');
        return;
      }

      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancel() {
    if (!bookingId) {
      setError('Unable to cancel this booking.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/bookings/${bookingId}/cancel`,
        {
          method: 'POST',
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'Unable to cancel this booking.');
        return;
      }

      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  if (isBooked) {
    return (
      <div>
        <Button
          variant="outline"
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
        >
          {isLoading ? 'Cancelling...' : 'Cancel'}
        </Button>

        {error && (
          <p
            role="alert"
            className="schedule-table__booking-error"
          >
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <label>
        <span className="sr-only">
          Number of attendees
        </span>

        <select
          value={attendeeCount}
          onChange={(event) =>
            setAttendeeCount(Number(event.target.value))
          }
          disabled={isLoading}
        >
          {Array.from(
            { length: Math.min(spotsRemaining, 10) },
            (_, index) => index + 1,
          ).map((count) => (
            <option key={count} value={count}>
              {count} {count === 1 ? 'person' : 'people'}
            </option>
          ))}
        </select>
      </label>

      <Button
        variant="primary"
        type="button"
        onClick={handleBook}
        disabled={isLoading}
      >
        {isLoading ? 'Booking...' : 'Book'}
      </Button>

      {error && (
        <p
          role="alert"
          className="schedule-table__booking-error"
        >
          {error}
        </p>
      )}
    </div>
  );
}