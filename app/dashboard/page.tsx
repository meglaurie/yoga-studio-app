import Link from "next/link";

import CancelBookingButton from "@/components/dashboard/CancelBookingButton";
import ClassPassCard from "@/components/dashboard/ClassPassCard";
import DashboardSection from "@/components/dashboard/DashboardSection";
import PurchaseHistory from "@/components/dashboard/PurchaseHistory";

import { getMemberDashboardData } from "@/lib/member-dashboard";
import { requireUser } from "@/lib/authorization";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
  }).format(date);
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function DashboardPage() {
  const user = await requireUser();
  const dashboard = await getMemberDashboardData(user.id);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="border-b border-gray-200 pb-10">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
          Member dashboard
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Welcome back, {dashboard.user.name}
        </h1>

        <p className="mt-3 text-gray-600">
          {dashboard.user.email}
        </p>
      </header>

      <DashboardSection
        title="Class passes"
        description="Your available class credits."
        action={
          <Link
            href="/pricing"
            className="text-sm font-medium underline underline-offset-4"
          >
            Buy a pass
          </Link>
        }
      >
        {dashboard.classPasses.length === 0 ? (
          <div className="rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-600">
              You don't have any class passes yet.
            </p>

            <Link
              href="/pricing"
              className="mt-4 inline-block rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              View class passes
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {dashboard.classPasses.map((pass) => (
              <ClassPassCard
                key={pass.id}
                name={pass.purchase.product.name}
                totalCredits={pass.totalCredits}
                remainingCredits={pass.remainingCredits}
                expiresAt={pass.expiresAt}
              />
            ))}
          </div>
        )}
      </DashboardSection>

      <DashboardSection
        title="Upcoming bookings"
        description="Classes you've reserved."
        action={
          <Link
            href="/schedule"
            className="text-sm font-medium underline underline-offset-4"
          >
            Browse schedule
          </Link>
        }
      >
        {dashboard.upcomingBookings.length === 0 ? (
          <div className="rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-600">
              You don't have any upcoming bookings.
            </p>

            <Link
              href="/schedule"
              className="mt-4 inline-block rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              Browse the schedule
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {dashboard.upcomingBookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-6 md:flex-row">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold">
                        {booking.class.name}
                      </h3>

                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        Confirmed
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                      <p>
                        <span className="font-medium">
                          Date:
                        </span>{" "}
                        {formatDate(
                          booking.class.startAt,
                        )}
                      </p>

                      <p>
                        <span className="font-medium">
                          Time:
                        </span>{" "}
                        {new Intl.DateTimeFormat("en-CA", {
                          hour: "numeric",
                          minute: "2-digit",
                        }).format(
                          booking.class.startAt,
                        )}{" "}
                        –{" "}
                        {new Intl.DateTimeFormat("en-CA", {
                          hour: "numeric",
                          minute: "2-digit",
                        }).format(
                          booking.class.endAt,
                        )}
                      </p>

                      <p>
                        <span className="font-medium">
                          Instructor:
                        </span>{" "}
                        {booking.class.instructorName}
                      </p>

                      <p className="text-gray-600">
                        {booking.class.level}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end">
                    <CancelBookingButton
                      bookingId={booking.id}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </DashboardSection>

      <DashboardSection
        title="Membership"
        description="Your current membership status."
        action={
          !dashboard.activeMembership ? (
            <Link
              href="/pricing"
              className="text-sm font-medium underline underline-offset-4"
            >
              View plans
            </Link>
          ) : undefined
        }
      >
        {dashboard.activeMembership ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-semibold">
                    {
                      dashboard.activeMembership
                        .purchase.product.name
                    }
                  </h3>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    Active
                  </span>
                </div>

                <p className="mt-3 text-sm text-gray-600">
                  Valid through{" "}
                  {formatDate(
                    dashboard.activeMembership.expiresAt,
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-600">
              You don't currently have an active membership.
            </p>

            <Link
              href="/pricing"
              className="mt-4 inline-block rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              View membership options
            </Link>
          </div>
        )}
      </DashboardSection>

      <DashboardSection
        title="Purchase history"
        description="A record of your purchases and payment status."
      >
        <PurchaseHistory
          purchases={dashboard.purchases}
        />
      </DashboardSection>
    </main>
  );
}