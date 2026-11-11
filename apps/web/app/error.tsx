'use client';

import { useEffect } from 'react';
import { Button } from '@gtour/ui';

/** Route-level error boundary: keeps the site chrome and offers a retry. */
export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="gtour-section">
      <div className="gtour-container flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="gtour-eyebrow">Something went wrong</p>
        <h1 className="mt-3 max-w-2xl text-balance font-display text-display-sm font-semibold text-ink-900">
          We could not finish loading this page
        </h1>
        <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink-500">
          The travel service may be temporarily unavailable. Try again, or continue browsing from the
          destinations page.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
        </div>
        {error.digest ? (
          <p className="mt-6 text-xs text-ink-400">Reference: {error.digest}</p>
        ) : null}
      </div>
    </div>
  );
}