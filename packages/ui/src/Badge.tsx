import { cn } from '@gtour/utils';

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'sea' | 'terracotta' | 'gold' | 'ink';
  className?: string;
}) {
  const tones = {
    neutral: 'bg-sand-200 text-ink-700',
    sea: 'bg-sea-100 text-sea-700',
    terracotta: 'bg-terracotta-100 text-terracotta-700',
    gold: 'bg-gold-300/40 text-gold-600',
    ink: 'bg-ink-900 text-sand-50',
  } as const;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-semibold uppercase tracking-wider',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function RatingBadge({ value, className }: { value?: number; className?: string }) {
  // Ratings are only shown when the API actually supplies one.
  if (typeof value !== 'number' || Number.isNaN(value)) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-pill bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink-900 shadow-soft',
        className
      )}
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-gold-500">
        <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L1.5 7.7l5.9-.9z" />
      </svg>
      {value.toFixed(1)}
    </span>
  );
}
