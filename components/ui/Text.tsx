import clsx from "clsx";

type TextVariant =
  | "body"
  | "lead"
  | "muted"
  | "small";

interface TextProps {
  variant?: TextVariant;
  children: React.ReactNode;
  className?: string;
}

export default function Text({
  variant = "body",
  children,
  className,
}: TextProps) {
  return (
    <p
      className={clsx(
        "text",
        `text--${variant}`,
        className
      )}
    >
      {children}
    </p>
  );
}