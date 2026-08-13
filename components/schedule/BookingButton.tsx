'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';

interface BookingButtonProps {
  classId: string;
  isBooked: boolean;
}

export default function BookingButton({
  classId,
  isBooked,
}: BookingButtonProps) {
  const router = useRouter();

  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBooking() {
    setIsBooking(true);
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
      setIsBooking(false);
    }
  }

  if (isBooked) {
    return (
      <Button variant="outline" disabled>
        Booked
      </Button>
    );
  }

  return (
    <div>
      <Button
        variant="primary"
        type="button"
        onClick={handleBooking}
        disabled={isBooking}
      >
        {isBooking ? 'Booking...' : 'Book'}
      </Button>

      {error && (
        <p role="alert" className="schedule-table__booking-error">
          {error}
        </p>
      )}
    </div>
  );
}