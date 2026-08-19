"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const levels = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "ALL_LEVELS", label: "All levels" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
] as const;

export default function CreateClassForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [level, setLevel] = useState("ALL_LEVELS");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [capacity, setCapacity] = useState("12");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/owner/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          instructorName,
          level,
          startAt,
          endAt,
          capacity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to create class.");
        return;
      }

      router.push("/owner/classes");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-900"
        >
          Class name
        </label>

        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Morning Flow"
          required
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-900"
        >
          Description
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="A grounding flow to start your morning."
          rows={4}
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
        />
      </div>

      <div>
        <label
          htmlFor="instructorName"
          className="block text-sm font-medium text-gray-900"
        >
          Instructor
        </label>

        <input
          id="instructorName"
          type="text"
          value={instructorName}
          onChange={(event) =>
            setInstructorName(event.target.value)
          }
          placeholder="Maya"
          required
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
        />
      </div>

      <div>
        <label
          htmlFor="level"
          className="block text-sm font-medium text-gray-900"
        >
          Level
        </label>

        <select
          id="level"
          value={level}
          onChange={(event) => setLevel(event.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
        >
          {levels.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="startAt"
            className="block text-sm font-medium text-gray-900"
          >
            Start
          </label>

          <input
            id="startAt"
            type="datetime-local"
            value={startAt}
            onChange={(event) => setStartAt(event.target.value)}
            required
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="endAt"
            className="block text-sm font-medium text-gray-900"
          >
            End
          </label>

          <input
            id="endAt"
            type="datetime-local"
            value={endAt}
            onChange={(event) => setEndAt(event.target.value)}
            required
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="capacity"
          className="block text-sm font-medium text-gray-900"
        >
          Capacity
        </label>

        <input
          id="capacity"
          type="number"
          min="1"
          max="100"
          value={capacity}
          onChange={(event) => setCapacity(event.target.value)}
          required
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
        />
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/owner/classes")}
          className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating..." : "Create class"}
        </button>
      </div>
    </form>
  );
}