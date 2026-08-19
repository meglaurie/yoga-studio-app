interface DashboardSectionProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardSection({
  title,
  description,
  action,
  children,
}: DashboardSectionProps) {
  return (
    <section className="mt-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm text-gray-600">
              {description}
            </p>
          )}
        </div>

        {action}
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}