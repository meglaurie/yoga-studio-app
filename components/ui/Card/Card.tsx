type CardProps = {
  children: React.ReactNode;
};

export function Card({ children }: CardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      {children}
    </div>
  );
}