export default function UserStatusBadge({
  status,
}: {
  status: "ACTIVE" | "DEACTIVATED";
}) {
  if (status === "ACTIVE") {
    return null;
  }

  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
      Deactivated
    </span>
  );
}