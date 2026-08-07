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
