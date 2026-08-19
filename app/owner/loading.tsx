export default function OwnerDashboardLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="animate-pulse">
        <div className="h-4 w-32 rounded bg-gray-200" />
        <div className="mt-4 h-12 w-80 rounded bg-gray-200" />
        <div className="mt-3 h-5 w-64 rounded bg-gray-200" />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="h-32 rounded-xl bg-gray-100" />
          <div className="h-32 rounded-xl bg-gray-100" />
          <div className="h-32 rounded-xl bg-gray-100" />
          <div className="h-32 rounded-xl bg-gray-100" />
        </div>

        <div className="mt-12 h-8 w-48 rounded bg-gray-200" />

        <div className="mt-6 h-96 rounded-xl bg-gray-100" />
      </div>
    </main>
  );
}