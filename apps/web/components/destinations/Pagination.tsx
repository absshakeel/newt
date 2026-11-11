import Link from 'next/link';
import { cn } from '@gtour/utils';

/**
 * Numbered pagination that preserves the active filter query string.
 * Renders nothing when there is only one page.
 */
export default function Pagination({
  page,
  pages,
  buildHref,
  className,
}: {
  page: number;
  pages: number;
  buildHref: (page: number) => string;
  className?: string;
}) {
  if (pages <= 1) return null;

  const windowSize = 5;
  const start = Math.max(1, Math.min(page - Math.floor(windowSize / 2), pages - windowSize + 1));
  const end = Math.min(pages, start + windowSize - 1);
  const numbers = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  const linkClass =
    'inline-flex h-10 min-w-10 items-center justify-center rounded-pill border px-3 text-sm font-semibold transition-colors duration-200';

  return (
    <nav aria-label="Destination pages" className={cn('flex flex-wrap items-center justify-center gap-2', className)}>
      {page > 1 ? (
        <Link
          href={buildHref(page - 1)}
          rel="prev"
          className={cn(linkClass, 'border-ink-200 bg-white text-ink-700 hover:border-sea-400 hover:text-sea-700')}
        >
          Previous
        </Link>
      ) : null}

      {start > 1 ? (
        <>
          <Link
            href={buildHref(1)}
            className={cn(linkClass, 'border-ink-200 bg-white text-ink-700 hover:border-sea-400 hover:text-sea-700')}
          >
            1
          </Link>
          <span aria-hidden="true" className="px-1 text-ink-400">
            …
          </span>
        </>
      ) : null}

      {numbers.map((number) => {
        const current = number === page;
        return (
          <Link
            key={number}
            href={buildHref(number)}
            aria-current={current ? 'page' : undefined}
            className={cn(
              linkClass,
              current
                ? 'border-sea-500 bg-sea-500 text-white'
                : 'border-ink-200 bg-white text-ink-700 hover:border-sea-400 hover:text-sea-700'
            )}
          >
            {number}
          </Link>
        );
      })}

      {end < pages ? (
        <>
          <span aria-hidden="true" className="px-1 text-ink-400">
            …
          </span>
          <Link
            href={buildHref(pages)}
            className={cn(linkClass, 'border-ink-200 bg-white text-ink-700 hover:border-sea-400 hover:text-sea-700')}
          >
            {pages}
          </Link>
        </>
      ) : null}

      {page < pages ? (
        <Link
          href={buildHref(page + 1)}
          rel="next"
          className={cn(linkClass, 'border-ink-200 bg-white text-ink-700 hover:border-sea-400 hover:text-sea-700')}
        >
          Next
        </Link>
      ) : null}
    </nav>
  );
}