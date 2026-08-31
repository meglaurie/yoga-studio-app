import { requireOwner } from "@/lib/authorization";
import OwnerSidebarNav from "@/components/owner/OwnerSidebarNav";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOwner();

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-6 py-12">
      <aside className="w-56 shrink-0">
        <p className="px-4 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
          Owner dashboard
        </p>
        <div className="mt-4">
          <OwnerSidebarNav />
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}