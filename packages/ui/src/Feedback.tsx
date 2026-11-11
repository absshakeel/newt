import { cn } from '@gtour/utils';

/** Neutral shimmer block used while remote data loads. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-shimmer rounded-xl bg-[linear-gradient(90deg,#EFE6D8_25%,#F8F3EA_50%,#EFE6D8_75%)] bg-[length:200%_100%]',
        className
      )}
    />
  );
}

export function CardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-4">
          <Skeleton className="aspect-[4/3] w-full rounded-card" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  compact,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-panel border border-dashed border-ink-200/80 bg-white/60 text-center',
        compact ? 'px-5 py-8' : 'px-6 py-12 sm:py-14'
      )}
    >
      {icon ? <div className={cn('text-sea-500', compact ? 'mb-2' : 'mb-3')}>{icon}</div> : null}
      <h3 className={cn('font-display text-ink-900', compact ? 'text-lg' : 'text-xl')}>{title}</h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink-500">{description}</p>
      {action ? <div className={cn(compact ? 'mt-4' : 'mt-5')}>{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = 'We could not load this section',
  description,
  onRetry,
  retryLabel = 'Try again',
  compact,
}: {
  title?: string;
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
  compact?: boolean;
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center rounded-panel border border-terracotta-200/80 bg-terracotta-50/50 text-center',
        compact ? 'px-5 py-7' : 'px-6 py-10'
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-terracotta-500/10 text-terracotta-700',
          compact ? 'mb-2 h-9 w-9' : 'mb-3 h-10 w-10'
        )}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      </div>
      <h3 className={cn('font-display text-ink-900', compact ? 'text-base' : 'text-lg')}>{title}</h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink-600">{description}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            'inline-flex items-center rounded-pill bg-ink-900 px-5 text-sm font-semibold text-sand-50 transition-colors hover:bg-ink-800',
            compact ? 'mt-4 h-9' : 'mt-5 h-10'
          )}
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}

/** Screen-reader-visible status text for async regions. */
export function LiveStatus({ children }: { children: React.ReactNode }) {
  return (
    <p role="status" aria-live="polite" className="text-sm text-ink-500">
      {children}
    </p>
  );
}
