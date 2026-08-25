export default function ClassStatusBadge({
  status,
}: {
  status: "SCHEDULED" | "CANCELLED";
}) {
  if (status === "SCHEDULED") {
    return null;
  }

  return (
    <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
      Cancelled
    </span>
  );
}