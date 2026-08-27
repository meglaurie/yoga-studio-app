"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeactivateUserButton({
  userId,
  name,
  status,
}: {
  userId: string;
  name: string;
  status: "ACTIVE" | "DEACTIVATED";
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isActive = status === "ACTIVE";

  async function handleToggle() {
    if (isActive) {
      const confirmed = window.confirm(
        `Deactivate ${name}'s account? They won't be able to log in until reactivated.`,
      );
      if (!confirmed) return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/owner/users/${userId}`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to update user.");
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
        className={`rounded-lg border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
          isActive
            ? "border-red-300 text-red-700 hover:bg-red-50"
            : "border-gray-300 hover:bg-gray-50"
        }`}
      >
        {isSubmitting ? "Saving..." : isActive ? "Deactivate" : "Reactivate"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}