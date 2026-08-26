import Link from "next/link";

import { requireOwner } from "@/lib/authorization";
import CreateProductForm from "@/components/owner/CreateProductForm";

export default async function NewOwnerProductPage() {
  await requireOwner();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-8">
        <Link
          href="/owner/products"
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          ← Back to products
        </Link>

        <p className="mt-8 text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
          Owner dashboard
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Add a product
        </h1>

        <p className="mt-3 text-gray-600">
          Create a new product for members to purchase.
        </p>
      </header>

      <CreateProductForm />
    </main>
  );
}