// import clsx from "clsx";

// interface StackProps {
//   children: React.ReactNode;
//   gap?: "sm" | "md" | "lg" | "xl";
//   className?: string;
// }

// const gapClasses = {
//   sm: "gap-2",
//   md: "gap-4",
//   lg: "gap-6",
//   xl: "gap-8",
// };

// export default function Stack({
//   children,
//   gap = "md",
//   className,
// }: StackProps) {
//   return (
//     <div
//       className={clsx(
//         "flex flex-col",
//         gapClasses[gap],
//         className
//       )}
//     >
//       {children}
//     </div>
//   );
// }

interface StackProps {
  children: React.ReactNode;

  size?: 'sm' | 'md' | 'lg';

  className?: string;
}

export default function Stack({
  children,

  size = 'md',

  className,
}: StackProps) {
  return <div className={`stack stack--${size} ${className ?? ''}`}>{children}</div>;
}
