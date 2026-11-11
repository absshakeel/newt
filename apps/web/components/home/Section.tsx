import Link from 'next/link';
import { Reveal } from '@gtour/ui';
import { cn } from '@gtour/utils';

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
        className
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        <p className="gtour-eyebrow">{eyebrow}</p>
        <h2 className="mt-3 text-balance font-display text-display-sm font-semibold text-ink-900">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-pretty text-base leading-relaxed text-ink-500">{description}</p>
        ) : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-2 rounded-pill border border-ink-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-ink-800 transition-colors duration-200 hover:border-sea-400 hover:text-sea-700"
        >
          {action.label}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4 stroke-current transition-transform duration-300 ease-premium group-hover:translate-x-1"
            fill="none"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      ) : null}
    </div>
  );
}

/** Consistent vertical rhythm wrapper for every landing section. */
export function Section({
  children,
  className,
  id,
  ...rest
}: React.ComponentPropsWithoutRef<'section'>) {
  return (
    <section id={id} className={cn('gtour-section', className)} {...rest}>
      <div className="gtour-container">{children}</div>
    </section>
  );
}

export { Reveal };