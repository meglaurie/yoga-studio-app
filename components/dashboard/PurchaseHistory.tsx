interface Purchase {
  id: string;
  amountCents: number;
  currency: string;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  createdAt: Date;
  product: {
    name: string;
  };
}

interface PurchaseHistoryProps {
  purchases: Purchase[];
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
  }).format(date);
}

function formatMoney(amountCents: number, currency: string) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
  }).format(amountCents / 100);
}

const statusStyles = {
  PAID: "bg-green-50 text-green-700",
  PENDING: "bg-yellow-50 text-yellow-700",
  FAILED: "bg-red-50 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-600",
} as const;

export default function PurchaseHistory({
  purchases,
}: PurchaseHistoryProps) {
  if (purchases.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 p-6">
        <p className="text-sm text-gray-600">
          You haven't made any purchases yet.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="divide-y divide-gray-100">
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3 className="font-medium">
                {purchase.product.name}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {formatDate(purchase.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-medium">
                {formatMoney(
                  purchase.amountCents,
                  purchase.currency,
                )}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[purchase.status]}`}
              >
                {purchase.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}