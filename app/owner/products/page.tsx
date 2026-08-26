import Link from "next/link";

import { requireOwner } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import ToggleProductActiveButton from "@/components/owner/ToggleProductActiveButton";

function formatProductType(type: string) {
  return type
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatPrice(priceCents: number, currency: string) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

export default async function ManageProductsPage() {
  await requireOwner();

  const products = await prisma.product.findMany({
    orderBy: [
      {
        active: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="flex flex-col gap-6 border-b border-gray-200 pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
            Owner dashboard
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Manage products
          </h1>

          <p className="mt-3 text-gray-600">
            Manage the products available for purchase at the studio.
          </p>
        </div>

        <Link
          href="/owner/products/new"
          className="inline-flex w-fit items-center justify-center rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Add product
        </Link>
      </header>

      <section className="mt-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Products
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            Active products are available for members to purchase.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {products.length === 0 ? (
            <div className="p-6">
              <p className="text-sm text-gray-600">
                No products have been created yet.
              </p>

              <Link
                href="/owner/products/new"
                className="mt-4 inline-block text-sm font-medium underline underline-offset-4"
              >
                Add your first product
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        {product.name}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          product.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {product.active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {product.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {product.description}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span>
                        {formatProductType(product.type)}
                      </span>

                      <span>
                        {formatPrice(
                          product.priceCents,
                          product.currency,
                        )}
                      </span>

                      {product.type === "CLASS_PASS" &&
                        product.creditCount !== null && (
                          <span>
                            {product.creditCount}{" "}
                            {product.creditCount === 1
                              ? "credit"
                              : "credits"}
                          </span>
                        )}
                    </div>
                  </div>

                 <div className="flex shrink-0 gap-3">
                  <Link
                    href={`/owner/products/${product.id}/edit`}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
                  >
                    Edit
                  </Link>
                  <ToggleProductActiveButton
                    productId={product.id}
                    active={product.active}
                  />
                </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}