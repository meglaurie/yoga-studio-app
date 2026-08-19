import Link from "next/link";

interface ClassPassCardProps {
  name: string;
  totalCredits: number;
  remainingCredits: number;
  expiresAt: Date;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
  }).format(date);
}

export default function ClassPassCard({
  name,
  totalCredits,
  remainingCredits,
  expiresAt,
}: ClassPassCardProps) {
  const percentage =
    totalCredits > 0
      ? Math.round((remainingCredits / totalCredits) * 100)
      : 0;

  const isExpired = expiresAt < new Date();
  const isDepleted = remainingCredits <= 0;

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">
            {name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {totalCredits}-class pass
          </p>
        </div>

        <span className="text-sm font-medium">
          {remainingCredits}/{totalCredits}
        </span>
      </div>

      <div
        className="mt-6 h-2 overflow-hidden rounded-full bg-gray-100"
        aria-label={`${remainingCredits} of ${totalCredits} credits remaining`}
      >
        <div
          className="h-full rounded-full bg-black transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-4">
        {isExpired ? (
          <p className="text-sm font-medium text-red-600">
            Expired {formatDate(expiresAt)}
          </p>
        ) : isDepleted ? (
          <p className="text-sm font-medium text-gray-500">
            No credits remaining
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Expires {formatDate(expiresAt)}
          </p>
        )}
      </div>

      {!isExpired && !isDepleted && (
        <Link
          href="/schedule"
          className="mt-6 inline-block rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          Book a class
        </Link>
      )}
    </article>
  );
}