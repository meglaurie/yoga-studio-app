import clsx from "clsx";

interface GridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export default function Grid({
  children,
  columns = 3,
  className,
}: GridProps) {
  return (
    <div
      className={clsx(
        "grid",
        `grid--${columns}`,
        className
      )}
    >
      {children}
    </div>
  );
}