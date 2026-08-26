import Link from "next/link";
import { notFound } from "next/navigation";

import { requireOwner } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import EditProductForm from "@/components/owner/EditProductForm";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  await requireOwner();

  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="border-b border-gray-200 pb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
          Owner dashboard
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Edit product
        </h1>

        <p className="mt-3 text-gray-600">
          Update the details for {product.name}.
        </p>
      </header>

      <div className="mt-10">
        <EditProductForm
          product={{
            id: product.id,
            type: product.type,
            name: product.name,
            description: product.description,
            priceCents: product.priceCents,
            creditCount: product.creditCount,
          }}
        />
      </div>

      <div className="mt-8">
        <Link
          href="/owner/products"
          className="text-sm font-medium underline underline-offset-4"
        >
          ← Back to manage products
        </Link>
      </div>
    </main>
  );
}