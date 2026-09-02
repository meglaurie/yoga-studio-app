import { requireOwner } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function OwnerMessagesPage() {
  await requireOwner();

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <header className="border-b border-gray-200 pb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
          Owner dashboard
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Messages
        </h1>
        <p className="mt-3 text-gray-600">
          Messages submitted through the contact page.
        </p>
      </header>

      <section className="mt-10 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {messages.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No messages yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map((msg) => (
              <div key={msg.id} className="p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold">{msg.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(msg.createdAt)}
                  </p>
                </div>
                <p className="text-sm text-gray-500">{msg.email}</p>
                <p className="mt-3 text-sm text-gray-700">{msg.message}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}