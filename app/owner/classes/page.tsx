import Link from "next/link";

import { requireOwner } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import CancelClassButton from "@/components/owner/CancelClassButton";
import ClassStatusBadge from "@/components/owner/ClassStatusBadge";

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

function formatLevel(level: string) {
  return level
    .toLowerCase()
    .replace("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function ManageClassesPage() {
  await requireOwner();

  const now = new Date();

  const classes = await prisma.class.findMany({
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

  const upcomingClasses = classes.filter(
    (yogaClass) => yogaClass.startAt >= now,
  );

  const pastClasses = classes.filter(
    (yogaClass) => yogaClass.startAt < now,
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="flex flex-col gap-6 border-b border-gray-200 pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
            Owner dashboard
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Manage classes
          </h1>

          <p className="mt-3 text-gray-600">
            Schedule, edit, and manage the studio&apos;s classes.
          </p>
        </div>

        <Link
          href="/owner/classes/new"
          className="inline-flex w-fit items-center justify-center rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Schedule class
        </Link>
      </header>

      <section className="mt-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Upcoming classes
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            Classes currently on the studio schedule.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {upcomingClasses.length === 0 ? (
            <div className="p-6">
              <p className="text-sm text-gray-600">
                There are no upcoming classes scheduled.
              </p>

              <Link
                href="/owner/classes/new"
                className="mt-4 inline-block text-sm font-medium underline underline-offset-4"
              >
                Schedule your first class
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {upcomingClasses.map((yogaClass) => (
                <article
                  key={yogaClass.id}
                  className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold">
                      {yogaClass.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      {formatDate(yogaClass.startAt)}
                      {" · "}
                      {formatTime(yogaClass.startAt)}
                      {" – "}
                      {formatTime(yogaClass.endAt)}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span>
                        Instructor: {yogaClass.instructorName}
                      </span>

                      <span>
                        Level: {formatLevel(yogaClass.level)}
                      </span>

                      <span>
                        {yogaClass._count.bookings}/{yogaClass.capacity}{" "}
                        booked
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-3">
                  <ClassStatusBadge status={yogaClass.status} />
                   {yogaClass.status !== "CANCELLED" && (
                      <CancelClassButton classId={yogaClass.id} className={yogaClass.name} />
                   )}
                    <Link
                      href={`/owner/classes/${yogaClass.id}/edit`}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {pastClasses.length > 0 && (
        <section className="mt-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Past classes
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Previous classes and their attendance.
            </p>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="divide-y divide-gray-100">
              {pastClasses.map((yogaClass) => (
                <article
                  key={yogaClass.id}
                  className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-semibold">{yogaClass.name}</h3>

                    <p className="mt-1 text-sm text-gray-600">
                      {formatDate(yogaClass.startAt)}
                      {" · "}
                      {formatTime(yogaClass.startAt)}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {yogaClass.instructorName}
                    </p>
                  </div>

                  <p className="text-sm text-gray-500">
                    {yogaClass._count.bookings}{" "}
                    {yogaClass._count.bookings === 1
                      ? "booking"
                      : "bookings"}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}