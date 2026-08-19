"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type EditClassFormProps = {
  yogaClass: {
    id: string;
    name: string;
    description: string | null;
    instructorName: string;
    level: string;
    startAt: string;
    endAt: string;
    capacity: number;
  };
};

const levels = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "ALL_LEVELS", label: "All Levels" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

function toLocalDateTimeValue(value: string) {
  const date = new Date(value);

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);

  return localDate.toISOString().slice(0, 16);
}

export default function EditClassForm({
  yogaClass,
}: EditClassFormProps) {
  const router = useRouter();

  const [name, setName] = useState(yogaClass.name);
  const [description, setDescription] = useState(
    yogaClass.description ?? "",
  );
  const [instructorName, setInstructorName] = useState(
    yogaClass.instructorName,
  );
  const [level, setLevel] = useState(yogaClass.level);
  const [startAt, setStartAt] = useState(
    toLocalDateTimeValue(yogaClass.startAt),
  );
  const [endAt, setEndAt] = useState(
    toLocalDateTimeValue(yogaClass.endAt),
  );
  const [capacity, setCapacity] = useState(
    String(yogaClass.capacity),
  );

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/owner/classes/${yogaClass.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            instructorName,
            level,
            startAt: new Date(startAt).toISOString(),
            endAt: new Date(endAt).toISOString(),
            capacity: Number(capacity),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to update class.");
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
    <form onSubmit={handleSubmit} className="space-y-6">
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
          required
          className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
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
          rows={4}
          className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
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
          required
          className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
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
          className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black"
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
            className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
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
            className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
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
          value={capacity}
          onChange={(event) => setCapacity(event.target.value)}
          required
          className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/owner/classes")}
          className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium transition hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}