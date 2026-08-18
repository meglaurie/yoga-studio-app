"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

interface CartProduct {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  currency: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatPrice(priceCents: number, currency: string) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(priceCents / 100);
}

export default function CartDrawer({
  isOpen,
  onClose,
}: CartDrawerProps) {
  const { productIds, removeFromCart, clearCart } = useCart();

  const [products, setProducts] = useState<CartProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!isOpen || productIds.length === 0) {
      return;
    }

    let cancelled = false;

    async function loadProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/products/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productIds }),
        });

        if (!response.ok) {
          throw new Error("Unable to load cart products.");
        }

        const data = await response.json();

        if (!cancelled) {
          setProducts(data.products);
        }
      } catch {
        if (!cancelled) {
          setError("We couldn't load your cart. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, [isOpen, productIds]);

  async function handleCheckout() {
    if (productIds.length === 0 || isCheckingOut) {
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productIds,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "Unable to start checkout.",
        );
      }

      if (!data.url) {
        throw new Error("Checkout URL was not returned.");
      }

      window.location.href = data.url;
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Unable to start checkout.",
      );
      setIsCheckingOut(false);
    }
  }

  // Only display products that are still in the cart.
  //
  // This avoids needing to synchronously call setProducts([])
  // when the cart becomes empty.
  const visibleProducts = products.filter((product) =>
    productIds.includes(product.id),
  );

  const totalCents = visibleProducts.reduce(
    (total, product) => total + product.priceCents,
    0,
  );

  const currency = visibleProducts[0]?.currency ?? "CAD";

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close cart"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 id="cart-title" className="text-xl font-semibold">
            Your Cart
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-sm"
            aria-label="Close cart"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isLoading && (
            <p className="text-sm text-gray-600">
              Loading cart...
            </p>
          )}

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          {!isLoading &&
            !error &&
            productIds.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-lg font-medium">
                  Your cart is empty.
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  Add a class pass, drop-in, or membership to get
                  started.
                </p>
              </div>
            )}

          {!isLoading &&
            !error &&
            visibleProducts.length > 0 && (
              <div className="space-y-4">
                {visibleProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-start justify-between gap-4 border-b pb-4"
                  >
                    <div>
                      <h3 className="font-medium">
                        {product.name}
                      </h3>

                      {product.description && (
                        <p className="mt-1 text-sm text-gray-600">
                          {product.description}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="font-medium">
                        {formatPrice(
                          product.priceCents,
                          product.currency,
                        )}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(product.id)
                        }
                        className="mt-2 text-sm underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        {visibleProducts.length > 0 && (
          <div className="border-t px-6 py-6">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total</span>

              <span className="text-lg font-semibold">
                {formatPrice(totalCents, currency)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="mt-4 w-full rounded-md bg-black px-4 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCheckingOut
                ? "Starting checkout..."
                : "Checkout"}
            </button>

            {checkoutError && (
              <p className="mt-3 text-sm text-red-600">
                {checkoutError}
              </p>
            )}

            <button
              type="button"
              onClick={clearCart}
              className="mt-3 w-full text-sm underline"
            >
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}