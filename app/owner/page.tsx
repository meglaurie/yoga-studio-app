import Link from "next/link";

import { requireOwner } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
  }).format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

const levelLabels = {
  BEGINNER: "Beginner",
  ALL_LEVELS: "All levels",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
} as const;

export default async function OwnerClassesPage() {
  await requireOwner();

  const classes = await prisma.class.findMany({
    where: {
      startAt: {
        gte: new Date(),
      },
    },
    orderBy: {
      startAt: "asc",
    },
    include: {
      _count: {
        select: {
          bookings: {
            where: {
              status: "CONFIRMED",
            },
          },
        },
      },
    },
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="flex flex-col gap-6 border-b border-gray-200 pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/owner"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← Owner dashboard
          </Link>

          <p className="mt-8 text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
            Class management
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Classes
          </h1>

          <p className="mt-3 text-gray-600">
            Manage upcoming classes on the studio schedule.
          </p>
        </div>

        <Link
          href="/owner/classes/new"
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Schedule a class
        </Link>
        <div className="mt-6">
            <Link
                href="/owner/classes"
                className="inline-flex rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
                Manage classes
            </Link>
        </div>
      </header>

      <section className="mt-10">
        {classes.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-lg font-semibold">
              No upcoming classes
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Schedule your first class to make it available to
              members.
            </p>

            <Link
              href="/owner/classes/new"
              className="mt-5 inline-flex rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              Schedule a class
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="divide-y divide-gray-100">
              {classes.map((yogaClass) => (
                <article
                  key={yogaClass.id}
                  className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h2 className="text-lg font-semibold">
                      {yogaClass.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                      {formatDate(yogaClass.startAt)}
                      {" · "}
                      {formatTime(yogaClass.startAt)}
                      {" – "}
                      {formatTime(yogaClass.endAt)}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      {yogaClass.instructorName}
                      {" · "}
                      {levelLabels[yogaClass.level]}
                    </p>
                  </div>

                  <div className="text-sm text-gray-600 sm:text-right">
                    <p>
                      <span className="font-semibold text-gray-900">
                        {yogaClass._count.bookings}
                      </span>{" "}
                      / {yogaClass.capacity} booked
                    </p>

                    <p className="mt-1">
                      {Math.max(
                        yogaClass.capacity -
                          yogaClass._count.bookings,
                        0,
                      )}{" "}
                      spots remaining
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}