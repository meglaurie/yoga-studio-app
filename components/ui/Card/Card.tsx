type CardProps = {
  children: React.ReactNode;
};

export function Card({ children }: CardProps) {
  return <div className="bg-card text-card-foreground rounded-lg border shadow-sm">{children}</div>;
}
