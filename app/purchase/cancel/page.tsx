import Link from "next/link";

export default function PurchaseCancelPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-6 py-16">
      <div className="w-full rounded-xl border bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-semibold">
          Checkout canceled
        </h1>

        <p className="mt-3 text-gray-600">
          Your payment was canceled. No charge was made.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/pricing"
            className="rounded-md bg-black px-5 py-3 text-sm font-medium text-white"
          >
            Return to Pricing
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