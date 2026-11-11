'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Adds an `.gtour-reveal` scroll-in effect to a wrapper without pulling in an
 * animation library. Falls back to immediately-visible content when the user
 * prefers reduced motion or when IntersectionObserver is unavailable.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  threshold?: number;
  once?: boolean;
}) {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (options?.once !== false) observer.unobserve(entry.target);
          }
        });
      },
      { threshold: options?.threshold ?? 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options?.once, options?.threshold]);

  return { ref, revealed };
}

/** Wrapper element that fades and lifts its children into view on scroll. */
export function Reveal({
  children,
  className,
  delayMs = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  as?: 'div' | 'section' | 'li' | 'article';
}) {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      data-revealed={revealed}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={`gtour-reveal ${className ?? ''}`}
    >
      {children}
    </Tag>
  );
}
