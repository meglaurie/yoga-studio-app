'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';

interface BookingButtonProps {
  classId: string;
  isBooked: boolean;
  bookingId: string | null;
}

export default function BookingButton({
  classId,
  isBooked,
  bookingId,
}: BookingButtonProps) {
  const router = useRouter();

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

  return (
    <div>
      <Button
        variant={isBooked ? 'outline' : 'primary'}
        type="button"
        onClick={isBooked ? handleCancel : handleBook}
        disabled={isLoading}
      >
        {isLoading
          ? isBooked
            ? 'Cancelling...'
            : 'Booking...'
          : isBooked
            ? 'Cancel'
            : 'Book'}
      </Button>

      {error && (
        <p role="alert" className="schedule-table__booking-error">
          {error}
        </p>
      )}
    </div>
  );
}