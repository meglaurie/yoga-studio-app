type Variant = "primary" | "secondary" | "outline" | "ghost" | "link";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        styles.button,
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}