"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ToggleProductActiveButton({
  productId,
  active,
}: {
  productId: string;
  active: boolean;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleToggle() {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/owner/products/${productId}`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to update product.");
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
        onClick={handleToggle}
        disabled={isSubmitting}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : active ? "Deactivate" : "Activate"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}