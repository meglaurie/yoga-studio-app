"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useCart } from "@/components/cart/CartProvider";

function PurchaseSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { clearCart } = useCart();

  useEffect(() => {
    window.localStorage.removeItem("stillwater-cart");
    clearCart();
  }, [clearCart]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-6 py-16">
      <div className="w-full rounded-xl border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-semibold">
          Payment successful
        </h1>

        <p className="mt-3 text-gray-600">
          Thank you for your purchase. Your payment has been received.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Your class pass or membership will be available once your
          payment has been confirmed.
        </p>

        {sessionId && (
          <p className="mt-6 break-all text-xs text-gray-400">
            Checkout session: {sessionId}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/schedule"
            className="rounded-md bg-black px-5 py-3 text-sm font-medium text-white"
          >
            Browse Classes
          </Link>

          <Link
            href="/"
            className="rounded-md border px-5 py-3 text-sm font-medium"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PurchaseSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-6 py-16">
          <div className="w-full rounded-xl border bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600">Loading purchase confirmation...</p>
          </div>
        </main>
      }
    >
      <PurchaseSuccessContent />
    </Suspense>
  );
}