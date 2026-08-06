import clsx from "clsx";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  variant?: HeadingLevel;
}

export function Heading({
  as: Component = "h2",
  variant,
  className,
  children,
  ...props
}: HeadingProps) {
  return (
    <Component
      className={clsx(
        "heading",
        `heading--${variant ?? Component}`,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}