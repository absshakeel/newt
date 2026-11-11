'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@gtour/utils';

type Step = {
  id: string;
  label: string;
  title: string;
  note: string;
};

const STEPS: Step[] = [
  { id: 'source', label: 'Start', title: 'Choose a place', note: 'Search destinations that match your style.' },
  { id: 'plan', label: 'Plan', title: 'Set your dates', note: 'Keep dates and guests with your search.' },
  { id: 'stay', label: 'Stay', title: 'Find services', note: 'Compare stays, guides, and transport.' },
  { id: 'arrive', label: 'Arrive', title: 'Travel ready', note: 'Details are confirmed by real services.' },
];

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Scroll-driven journey timeline (decorative). Replaces the previous hero scene:
 * progress advances from source to destination as the hero moves through view.
 * Uses transforms/opacity only; respects prefers-reduced-motion.
 */
export default function JourneyScrollScene({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setReducedMotion(true);
      setProgress(1);
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Start advancing once the hero is in view; finish as it scrolls away.
      const start = vh * 0.85;
      const end = -rect.height * 0.15;
      const p = clamp((start - rect.top) / (start - end));
      setProgress(p);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const activeIndex = useMemo(() => Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length + 0.0001)), [progress]);
  const pct = Math.round(progress * 100);

  return (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-panel border border-ink-100/90 bg-white/80 p-5 shadow-panel ring-1 ring-ink-900/5 backdrop-blur-sm sm:p-6',
        className
      )}
      aria-hidden="true"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sea-200/35 blur-3xl"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-terracotta-200/30 blur-3xl"
      />

      <div className="relative" style={{ perspective: reducedMotion ? undefined : '1100px' }}>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-sea-700">Journey</p>
            <p className="mt-1 font-display text-lg font-semibold text-ink-900">Source to destination</p>
          </div>
          <p className="rounded-pill bg-sand-100 px-3 py-1 text-xs font-semibold tabular-nums text-ink-600">
            {pct}%
          </p>
        </div>

        {/* 3D track */}
        <div
          className="relative mt-6 rounded-2xl border border-sand-200/80 bg-gradient-to-b from-sand-50 to-white p-4 sm:p-5"
          style={
            reducedMotion
              ? undefined
              : {
                  transform: `rotateX(${10 - progress * 6}deg) rotateY(${-6 + progress * 4}deg) translateZ(0)`,
                  transformStyle: 'preserve-3d',
                }
          }
        >
          <div className="relative px-1 pb-2 pt-8">
            <div className="absolute left-4 right-4 top-[2.35rem] h-[3px] rounded-full bg-sand-200" />
            <div
              className="absolute left-4 top-[2.35rem] h-[3px] rounded-full bg-gradient-to-r from-sea-500 via-sea-400 to-terracotta-500 transition-[width] duration-150 ease-out"
              style={{ width: `calc((100% - 2rem) * ${progress})` }}
            />
            <div
              className="absolute top-[1.85rem] flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-soft ring-2 ring-sea-500 transition-[left] duration-150 ease-out"
              style={{ left: `calc(1rem + (100% - 2rem) * ${progress})` }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-terracotta-500" />
            </div>

            <ol className="relative grid grid-cols-4 gap-2">
              {STEPS.map((step, i) => {
                const reached = progress >= (STEPS.length === 1 ? 1 : i / (STEPS.length - 1)) - 0.02;
                const active = i === activeIndex;
                return (
                  <li key={step.id} className="min-w-0 text-center">
                    <span
                      className={cn(
                        'mx-auto block h-2.5 w-2.5 rounded-full border-2 transition-colors duration-200',
                        reached ? 'border-sea-600 bg-sea-600' : 'border-sand-400 bg-white',
                        active && 'ring-4 ring-sea-100'
                      )}
                    />
                    <span
                      className={cn(
                        'mt-3 block text-[10px] font-semibold uppercase tracking-[0.14em]',
                        reached ? 'text-sea-700' : 'text-ink-400'
                      )}
                    >
                      {step.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {STEPS.map((step, i) => {
              const active = i === activeIndex;
              const passed = i < activeIndex;
              return (
                <div
                  key={step.id}
                  className={cn(
                    'rounded-2xl border px-3.5 py-3 transition-all duration-300',
                    active
                      ? 'border-sea-200 bg-sea-50/60 shadow-soft'
                      : passed
                        ? 'border-sand-200 bg-white/70'
                        : 'border-transparent bg-sand-50/50 opacity-80'
                  )}
                  style={
                    reducedMotion || !active
                      ? undefined
                      : { transform: 'translateZ(18px)', transformStyle: 'preserve-3d' }
                  }
                >
                  <p className="text-sm font-semibold text-ink-900">{step.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{step.note}</p>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-3 text-center text-[11px] text-ink-400">Scroll to follow the route.</p>
      </div>
    </div>
  );
}
