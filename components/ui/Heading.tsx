interface HeadingProps {
  children: React.ReactNode;

  as?: 'h1' | 'h2' | 'h3';

  size?: 'display' | 'h1' | 'h2' | 'h3';
}

export function Heading({
  children,

  as = 'h2',

  size = 'h2',
}: HeadingProps) {
  const Component = as;

  return <Component className={`heading heading--${size}`}>{children}</Component>;
}
