import Link from "next/link";

import { requireOwner } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import UserStatusBadge from "@/components/owner/UserStatusBadge";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(
    date,
  );
}

export default async function OwnerUsersPage() {
  await requireOwner();

  const users = await prisma.user.findMany({
    where: { role: "MEMBER" },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      _count: {
        select: {
          bookings: { where: { status: "CONFIRMED" } },
          purchases: { where: { status: "PAID" } },
        },
      },
    },
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="border-b border-gray-200 pb-10">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
          Owner dashboard
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Members
        </h1>
        <p className="mt-3 text-gray-600">
          View and manage member accounts.
        </p>
      </header>

      <section className="mt-10 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {users.length === 0 ? (
          <div className="p-6">
            <p className="text-sm text-gray-600">No members yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {users.map((user) => (
              <article
                key={user.id}
                className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                    <UserStatusBadge status={user.status} />
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{user.email}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Member since {formatDate(user.createdAt)} ·{" "}
                    {user._count.bookings} active booking
                    {user._count.bookings === 1 ? "" : "s"} ·{" "}
                    {user._count.purchases} purchase
                    {user._count.purchases === 1 ? "" : "s"}
                  </p>
                </div>

                <Link
                  href={`/owner/users/${user.id}`}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
                >
                  View details
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}