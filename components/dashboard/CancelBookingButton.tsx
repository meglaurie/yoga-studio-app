"use client";

import { useState } from "react";

interface CancelBookingButtonProps {
  bookingId: string;
}

export default function CancelBookingButton({
  bookingId,
}: CancelBookingButtonProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) {
      return;
    }

    setIsCancelling(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/bookings/${bookingId}/cancel`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.error ?? "Unable to cancel this booking.",
        );
      }

      window.location.reload();
    } catch (error) {
      setIsCancelling(false);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to cancel this booking.",
      );
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleCancel}
        disabled={isCancelling}
        className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isCancelling ? "Cancelling..." : "Cancel booking"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}