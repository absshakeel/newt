import Link from 'next/link';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@gtour/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-sea-500 text-white hover:bg-sea-600 active:bg-sea-700 shadow-soft disabled:bg-sea-300 disabled:text-white/80',
  secondary:
    'bg-ink-900 text-sand-50 hover:bg-ink-800 active:bg-ink-950 shadow-soft disabled:bg-ink-500 disabled:text-sand-100/80',
  outline:
    'border border-ink-200 bg-white/90 text-ink-800 hover:border-sea-400 hover:bg-sea-50 active:bg-sea-100 disabled:border-ink-100 disabled:text-ink-300',
  ghost: 'text-ink-700 hover:bg-sand-200/70 active:bg-sand-300 disabled:text-ink-300',
  danger:
    'bg-terracotta-600 text-white hover:bg-terracotta-700 active:bg-terracotta-700 shadow-soft disabled:bg-terracotta-300',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'min-h-[2.5rem] px-4 py-2 text-sm',
  md: 'min-h-[2.75rem] px-5 py-2.5 text-sm sm:px-6',
  lg: 'min-h-[3.25rem] px-6 py-3 text-[0.95rem] sm:px-8 sm:text-base',
};

const BASE =
  'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-pill font-semibold leading-none tracking-tight ' +
  'transition-[background-color,border-color,color,transform,box-shadow,opacity] duration-200 ease-premium ' +
  'hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-70 ' +
  'focus-visible:outline-none';

export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, type = 'button', ...props },
  ref
) {
  return (
    <button ref={ref} type={type} className={buttonClasses(variant, size, className)} {...props} />
  );
});

export interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/** Anchor styled as a button; used for every navigational call to action. */
export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className,
}: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)}>
      {children}
    </Link>
  );
}
