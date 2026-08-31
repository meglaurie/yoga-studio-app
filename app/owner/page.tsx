// app/owner/page.tsx
import Link from "next/link";

import { requireOwner } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(
    date,
  );
}

export default async function OwnerOverviewPage() {
  await requireOwner();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    upcomingClassesCount,
    activeMembersCount,
    activeMembershipsCount,
    recentPurchases,
    monthlyRevenueResult,
  ] = await Promise.all([
    prisma.class.count({
      where: {
        status: "SCHEDULED",
        startAt: { gte: now },
      },
    }),
    prisma.user.count({
      where: {
        role: "MEMBER",
        status: "ACTIVE",
      },
    }),
    prisma.membership.count({
      where: {
        startsAt: { lte: now },
        expiresAt: { gt: now },
        purchase: { status: "PAID" },
      },
    }),
    prisma.purchase.findMany({
      where: { status: "PAID" },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: { select: { name: true } },
        product: { select: { name: true } },
      },
    }),
    prisma.purchase.aggregate({
      where: {
        status: "PAID",
        createdAt: { gte: startOfMonth },
      },
      _sum: { amountCents: true },
    }),
  ]);

  const monthlyRevenueCents = monthlyRevenueResult._sum.amountCents ?? 0;

  const stats = [
    {
      label: "Upcoming classes",
      value: upcomingClassesCount,
      href: "/owner/classes",
    },
    {
      label: "Active members",
      value: activeMembersCount,
      href: "/owner/users",
    },
    {
      label: "Active memberships",
      value: activeMembershipsCount,
      href: "/owner/users",
    },
    {
      label: "Revenue this month",
      value: formatPrice(monthlyRevenueCents, "CAD"),
      href: null,
    },
  ];

  return (
    <main>
      <header className="border-b border-gray-200 pb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
          Owner dashboard
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Overview
        </h1>
        <p className="mt-3 text-gray-600">
          A snapshot of the studio right now.
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const content = (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">
                {stat.value}
              </p>
            </div>
          );

          return stat.href ? (
            <Link key={stat.label} href={stat.href} className="block transition hover:opacity-80">
              {content}
            </Link>
          ) : (
            <div key={stat.label}>{content}</div>
          );
        })}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">
          Recent purchases
        </h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {recentPurchases.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">No purchases yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentPurchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="flex flex-col gap-1 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{purchase.user.name}</p>
                    <p className="text-gray-500">{purchase.product.name}</p>
                  </div>
                  <div className="text-gray-500 sm:text-right">
                    <p>{formatPrice(purchase.amountCents, purchase.currency)}</p>
                    <p>{formatDate(purchase.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}