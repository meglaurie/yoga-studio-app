import Link from "next/link";
import { notFound } from "next/navigation";

import { requireOwner } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import EditClassForm from "@/components/owner/EditClassForm";

type EditClassPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditClassPage({
  params,
}: EditClassPageProps) {
  await requireOwner();

  const { id } = await params;

  const yogaClass = await prisma.class.findUnique({
    where: {
      id,
    },
  });

  if (!yogaClass) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="border-b border-gray-200 pb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
          Owner dashboard
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Edit class
        </h1>

        <p className="mt-3 text-gray-600">
          Update the details for {yogaClass.name}.
        </p>
      </header>

      <div className="mt-10">
        <EditClassForm
          yogaClass={{
            id: yogaClass.id,
            name: yogaClass.name,
            description: yogaClass.description,
            instructorName: yogaClass.instructorName,
            level: yogaClass.level,
            startAt: yogaClass.startAt.toISOString(),
            endAt: yogaClass.endAt.toISOString(),
            capacity: yogaClass.capacity,
          }}
        />
      </div>

      <div className="mt-8">
        <Link
          href="/owner/classes"
          className="text-sm font-medium underline underline-offset-4"
        >
          ← Back to manage classes
        </Link>
      </div>
    </main>
  );
}