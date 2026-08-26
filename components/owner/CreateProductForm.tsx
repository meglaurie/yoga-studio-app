"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const productTypes = [
  { value: "DROP_IN", label: "Drop-in" },
  { value: "CLASS_PASS", label: "Class Pass" },
  { value: "MONTHLY_MEMBERSHIP", label: "Monthly Membership" },
  { value: "ANNUAL_MEMBERSHIP", label: "Annual Membership" },
];

function requiresCreditCount(type: string) {
  return type === "DROP_IN" || type === "CLASS_PASS";
}

export default function CreateProductForm() {
  const router = useRouter();
  const [type, setType] = useState("DROP_IN");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceDollars, setPriceDollars] = useState("");
  const [creditCount, setCreditCount] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showCreditCount = requiresCreditCount(type);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/owner/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name,
          description,
          priceDollars: Number(priceDollars),
          creditCount: showCreditCount ? Number(creditCount) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to create product.");
        return;
      }

      router.push("/owner/products");
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
        <label htmlFor="type" className="block text-sm font-medium text-gray-900">
          Product type
        </label>
        <select
          id="type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black"
        >
          {productTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-gray-500">
          Product type cannot be changed after creation.
        </p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-900">
          Name
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
        <label htmlFor="description" className="block text-sm font-medium text-gray-900">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="priceDollars" className="block text-sm font-medium text-gray-900">
            Price (CAD)
          </label>
          <input
            id="priceDollars"
            type="number"
            min="0.01"
            step="0.01"
            value={priceDollars}
            onChange={(event) => setPriceDollars(event.target.value)}
            required
            className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        {showCreditCount && (
          <div>
            <label htmlFor="creditCount" className="block text-sm font-medium text-gray-900">
              Credits
            </label>
            <input
              id="creditCount"
              type="number"
              min="1"
              value={creditCount}
              onChange={(event) => setCreditCount(event.target.value)}
              required
              className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/owner/products")}
          className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium transition hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create product"}
        </button>
      </div>
    </form>
  );
}