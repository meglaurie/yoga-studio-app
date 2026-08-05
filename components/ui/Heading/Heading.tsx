type HeadingProps = {
  children: React.ReactNode;
};

export function Heading({ children }: HeadingProps) {
  return (
    <h1 className="text-3xl font-bold tracking-tight">
      {children}
    </h1>
  );
}