import clsx from 'clsx';

type Variant = 'primary' | 'outline' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function Button({
  variant = 'primary',

  className,

  children,

  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx('button', `button--${variant}`, className)}

      {...props}
    >
      {children}
    </button>
  );
}
