"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelClassButton({
  classId,
  className,
}: {
  classId: string;
  className: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleCancel() {
    const confirmed = window.confirm(
      `Cancel "${className}"? All confirmed bookings will be cancelled and any class-pass credits used will be refunded to members.`,
    );

    if (!confirmed) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/owner/classes/${classId}/cancel`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to cancel class.");
        return;
      }

      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleCancel}
        disabled={isSubmitting}
        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Cancelling..." : "Cancel class"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}