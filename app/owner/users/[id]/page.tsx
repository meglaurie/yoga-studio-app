import Link from "next/link";
import { notFound } from "next/navigation";

import { requireOwner } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import UserStatusBadge from "@/components/owner/UserStatusBadge";
import EditUserNameForm from "@/components/owner/EditUserNameForm";
import DeactivateUserButton from "@/components/owner/DeactivateUserButton";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(
    date,
  );
}

function formatPrice(priceCents: number, currency: string) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

type UserDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OwnerUserDetailPage({
  params,
}: UserDetailPageProps) {
  await requireOwner();

  const { id } = await params;
  const now = new Date();

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user || user.role !== "MEMBER") {
    notFound();
  }

  const [activeMembership, classPasses, purchases, upcomingBookings] =
    await Promise.all([
      prisma.membership.findFirst({
        where: {
          userId: id,
          startsAt: { lte: now },
          expiresAt: { gt: now },
          purchase: { status: "PAID" },
        },
        orderBy: { expiresAt: "desc" },
      }),
      prisma.classPass.findMany({
        where: { userId: id, purchase: { status: "PAID" } },
        orderBy: { expiresAt: "desc" },
      }),
      prisma.purchase.findMany({
        where: { userId: id },
        orderBy: { createdAt: "desc" },
        include: { product: true },
        take: 10,
      }),
      prisma.booking.findMany({
        where: {
          userId: id,
          status: "CONFIRMED",
          class: { startAt: { gte: now } },
        },
        orderBy: { class: { startAt: "asc" } },
        include: { class: true },
      }),
    ]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/owner/users"
        className="text-sm font-medium text-gray-500 hover:text-gray-900"
      >
        ← Back to members
      </Link>

      <header className="mt-8 flex flex-col gap-4 border-b border-gray-200 pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-semibold tracking-tight">
              {user.name}
            </h1>
            <UserStatusBadge status={user.status} />
          </div>
          <p className="mt-2 text-gray-600">{user.email}</p>
          <p className="mt-1 text-sm text-gray-500">
            Member since {formatDate(user.createdAt)}
          </p>
          <div className="mt-4">
            <EditUserNameForm userId={user.id} initialName={user.name} />
          </div>
        </div>

        <DeactivateUserButton
          userId={user.id}
          name={user.name}
          status={user.status}
        />
      </header>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Membership</h2>
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {activeMembership ? (
            <p className="text-sm text-gray-700">
              Active membership, expires{" "}
              {formatDate(activeMembership.expiresAt)}.
            </p>
          ) : (
            <p className="text-sm text-gray-500">No active membership.</p>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold tracking-tight">Class passes</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {classPasses.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">No class passes.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {classPasses.map((pass) => (
                <div
                  key={pass.id}
                  className="flex items-center justify-between p-4 text-sm"
                >
                  <span>
                    {pass.remainingCredits}/{pass.totalCredits} credits
                    remaining
                  </span>
                  <span className="text-gray-500">
                    Expires {formatDate(pass.expiresAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold tracking-tight">
          Upcoming bookings
        </h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {upcomingBookings.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">No upcoming bookings.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="p-4 text-sm">
                  <p className="font-medium">{booking.class.name}</p>
                  <p className="text-gray-500">
                    {formatDate(booking.class.startAt)} ·{" "}
                    {booking.attendeeCount} attendee
                    {booking.attendeeCount === 1 ? "" : "s"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold tracking-tight">
          Purchase history
        </h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {purchases.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">No purchases.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="flex items-center justify-between p-4 text-sm"
                >
                  <span>{purchase.product.name}</span>
                  <span className="text-gray-500">
                    {formatPrice(purchase.amountCents, purchase.currency)} ·{" "}
                    {purchase.status} · {formatDate(purchase.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}