"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type EditProductFormProps = {
  product: {
    id: string;
    type: string;
    name: string;
    description: string | null;
    priceCents: number;
    creditCount: number | null;
  };
};

function requiresCreditCount(type: string) {
  return type === "DROP_IN" || type === "CLASS_PASS";
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter();
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? "");
  const [priceDollars, setPriceDollars] = useState(
    String(product.priceCents / 100),
  );
  const [creditCount, setCreditCount] = useState(
    product.creditCount !== null ? String(product.creditCount) : "",
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showCreditCount = requiresCreditCount(product.type);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/owner/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          priceDollars: Number(priceDollars),
          creditCount: showCreditCount ? Number(creditCount) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to update product.");
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
        <label className="block text-sm font-medium text-gray-900">
          Product type
        </label>
        <p className="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          {product.type.replaceAll("_", " ")}
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Product type cannot be changed after creation. Deactivate this
          product and create a new one if the type needs to change.
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
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}