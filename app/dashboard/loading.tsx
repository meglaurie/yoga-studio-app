export default function DashboardLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="animate-pulse">
        <div className="h-4 w-32 rounded bg-gray-200" />
        <div className="mt-4 h-12 w-80 rounded bg-gray-200" />
        <div className="mt-3 h-5 w-64 rounded bg-gray-200" />

        <div className="mt-12 space-y-6">
          <div className="h-8 w-40 rounded bg-gray-200" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-48 rounded-xl bg-gray-100" />
            <div className="h-48 rounded-xl bg-gray-100" />
          </div>

          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-32 rounded-xl bg-gray-100" />

          <div className="h-8 w-32 rounded bg-gray-200" />
          <div className="h-28 rounded-xl bg-gray-100" />

          <div className="h-8 w-44 rounded bg-gray-200" />
          <div className="h-64 rounded-xl bg-gray-100" />
        </div>
      </div>
    </main>
  );
}