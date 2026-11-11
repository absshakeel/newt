'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@gtour/utils';
import { ButtonLink } from '@gtour/ui';

type Scene = {
  id: string;
  title: string;
  text: string;
  cta?: { href: string; label: string };
  mood: 'dawn' | 'road' | 'mountain' | 'coast' | 'culture' | 'arrival';
};

const SCENES: Scene[] = [
  {
    id: 'beginning',
    title: 'Every journey begins in a quiet moment.',
    text: 'A door. A morning light. A wish to see what waits beyond the familiar.',
    mood: 'dawn',
  },
  {
    id: 'journey',
    title: 'The world opens, one mile at a time.',
    text: 'Winding paths, open skies, and the feeling that everything ahead is possible.',
    mood: 'road',
  },
  {
    id: 'mountains',
    title: 'Where the earth rises to meet you.',
    text: 'Ridges, trails, and air so clear it feels like discovery itself.',
    mood: 'mountain',
  },
  {
    id: 'coast',
    title: 'Light, water, and endless blue.',
    text: 'Warm shores and slow horizons — the kind of beauty that asks you to stay.',
    mood: 'coast',
  },
  {
    id: 'culture',
    title: 'Places that carry time within them.',
    text: 'Streets, craft, and history still breathing — destinations that stay with you.',
    mood: 'culture',
  },
  {
    id: 'arrival',
    title: 'Some journeys lead you somewhere unforgettable.',
    text: 'You’ve arrived. The world is here — find the place that feels like yours.',
    mood: 'arrival',
    cta: { href: '/destinations', label: 'Find your destination' },
  },
];

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

export default function VerticalJourney() {
  return (
    <div id="journey-story" className="relative bg-sand-fade">
      <div className="relative">
        {SCENES.map((scene, i) => (
          <JourneyScene key={scene.id} scene={scene} index={i} />
        ))}
      </div>
    </div>
  );
}

function JourneyScene({ scene, index }: { scene: Scene; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const prefers =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefers) {
      setReduced(true);
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={`journey-${scene.id}`}
      className={cn(
        'relative flex min-h-[88svh] items-center py-16 sm:min-h-[92svh] sm:py-20',
        index === 0 && 'pt-12 sm:pt-16'
      )}
    >
      <div className="gtour-container">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div
            className={cn(
              'relative z-10',
              !reduced && 'transition-all duration-700 ease-out',
              !reduced && (visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0')
            )}
          >
            <h2 className="max-w-xl text-balance font-display text-display-sm font-semibold leading-[1.08] text-ink-900 sm:text-display">
              {scene.title}
            </h2>
            <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-ink-500 sm:text-lg">
              {scene.text}
            </p>
            {scene.cta ? (
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={scene.cta.href} size="lg">
                  {scene.cta.label}
                </ButtonLink>
                <ButtonLink href="/hotels" variant="secondary" size="lg">
                  Find your stay
                </ButtonLink>
              </div>
            ) : null}
          </div>

          <div
            className={cn(
              'relative',
              !reduced && 'transition-all duration-700 ease-out delay-100',
              !reduced && (visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0')
            )}
          >
            <SceneVisual mood={scene.mood} />
          </div>
        </div>
      </div>
    </section>
  );
}

function SceneVisual({ mood }: { mood: Scene['mood'] }) {
  const palettes: Record<Scene['mood'], { a: string; b: string; c: string; accent: string; dark?: boolean }> = {
    dawn: { a: '#F6EFE6', b: '#E3F1F1', c: '#FDFBF7', accent: '#C96B45' },
    road: { a: '#E7F4F3', b: '#F8F3EA', c: '#FDFBF7', accent: '#147A80' },
    mountain: { a: '#DCEFED', b: '#9EC8C9', c: '#F3FAF9', accent: '#0F6167' },
    coast: { a: '#EAF6F6', b: '#9FD3D5', c: '#FFF8F0', accent: '#3B9BA0' },
    culture: { a: '#F6ECE4', b: '#E8C9B0', c: '#FDFBF7', accent: '#C29B3C' },
    arrival: { a: '#243B45', b: '#1C3442', c: '#2F4A52', accent: '#E6CE93', dark: true },
  };
  const pal = palettes[mood];

  return (
    <div
      className={cn(
        'relative aspect-[4/3] w-full overflow-hidden rounded-panel border shadow-soft ring-1 sm:aspect-[5/4]',
        pal.dark ? 'border-white/10 ring-white/10' : 'border-ink-100/70 ring-ink-900/5'
      )}
    >
      <svg viewBox="0 0 800 600" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`bg-${mood}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={pal.a} />
            <stop offset="55%" stopColor={pal.c} />
            <stop offset="100%" stopColor={pal.b} />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill={`url(#bg-${mood})`} />
        <path d="M0 430 C 160 385, 320 445, 520 405 C 640 380, 720 415, 800 395 L800 600 L0 600 Z" fill={pal.dark ? '#FDFBF7' : '#0F6167'} opacity={pal.dark ? 0.06 : 0.1} />

        {mood === 'dawn' && (
          <g>
            <circle cx="560" cy="170" r="52" fill="#E6CE93" opacity="0.95" />
            <g transform="translate(130 355)">
              <rect x="0" y="22" width="70" height="50" rx="4" fill="#F8F3EA" stroke="#CBB79B" />
              <path d="M-6 22 L35 0 L76 22 Z" fill="#C96B45" />
              <rect x="28" y="46" width="14" height="26" rx="2" fill="#B29B7C" />
            </g>
            <path d="M200 435 C 300 422, 420 455, 560 432 C 660 418, 720 438, 820 425" stroke="#C96B45" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8" />
          </g>
        )}

        {mood === 'road' && (
          <g>
            <path d="M-30 530 C 170 475, 320 505, 460 455 C 600 402, 700 425, 840 380" stroke="#147A80" strokeWidth="12" strokeLinecap="round" fill="none" opacity="0.18" />
            <path d="M-30 530 C 170 475, 320 505, 460 455 C 600 402, 700 425, 840 380" stroke="#C96B45" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {[{ x: 210, h: 80 }, { x: 300, h: 58 }, { x: 620, h: 66 }].map((t, i) => (
              <g key={i} transform={`translate(${t.x} ${470 - t.h})`}>
                <rect x="-3" y={t.h - 22} width="6" height="22" rx="3" fill="#8E7960" />
                <circle cx="0" cy={t.h - 32} r="20" fill="#147A80" opacity="0.7" />
              </g>
            ))}
            <ellipse cx="260" cy="160" rx="100" ry="24" fill="#fff" opacity="0.5" />
          </g>
        )}

        {mood === 'mountain' && (
          <g>
            <path d="M0 520 L150 250 L270 480 L430 160 L570 460 L730 270 L800 410 L800 600 L0 600 Z" fill="#5FA6AA" opacity="0.95" />
            <path d="M430 160 L485 305 L430 340 L375 305 Z" fill="#FDFBF7" opacity="0.8" />
            <circle cx="630" cy="140" r="34" fill="#E6CE93" opacity="0.9" />
          </g>
        )}

        {mood === 'coast' && (
          <g>
            <circle cx="590" cy="150" r="44" fill="#F3D2C1" opacity="0.95" />
            <path d="M0 375 C 180 350, 340 400, 520 372 C 660 350, 740 378, 800 360 L800 600 L0 600 Z" fill="#7FBFC2" opacity="0.6" />
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M0 ${420 + i * 34} C 200 ${406 + i * 34}, 380 ${438 + i * 34}, 560 ${418 + i * 34} C 700 ${404 + i * 34}, 760 ${428 + i * 34}, 800 ${416 + i * 34}`} stroke="#fff" strokeOpacity={0.35 - i * 0.06} strokeWidth={3} fill="none" />
            ))}
            <path d="M0 355 C 160 335, 320 360, 480 345 C 640 330, 720 345, 800 335 L800 375 L0 375 Z" fill="#E8AE90" opacity="0.4" />
          </g>
        )}

        {mood === 'culture' && (
          <g>
            <circle cx="170" cy="140" r="32" fill="#E6CE93" opacity="0.85" />
            <g transform="translate(290 290)">
              <path d="M0 170 L0 75 C0 32 45 0 110 0 C175 0 220 32 220 75 L220 170 Z" fill="#E8AE90" opacity="0.95" />
              <rect x="90" y="95" width="40" height="75" rx="5" fill="#98472A" opacity="0.55" />
              <path d="M110 -12 L110 -45" stroke="#C29B3C" strokeWidth="5" strokeLinecap="round" />
              <circle cx="110" cy="-52" r="8" fill="#C29B3C" />
            </g>
          </g>
        )}

        {mood === 'arrival' && (
          <g>
            {[{ x: 120, y: 90 }, { x: 260, y: 140 }, { x: 640, y: 110 }, { x: 520, y: 60 }, { x: 380, y: 170 }].map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={i % 2 ? 2.5 : 1.8} fill="#FDFBF7" opacity="0.7" />
            ))}
            <circle cx="580" cy="160" r="34" fill="#E6CE93" opacity="0.85" />
            <path d="M0 455 C 180 420, 320 465, 500 435 C 660 408, 740 445, 800 425 L800 600 L0 600 Z" fill="#147A80" opacity="0.22" />
            <path d="M70 475 C 220 452, 360 472, 520 458 C 640 446, 720 458, 790 452" stroke="#C96B45" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.9" />
            <g transform="translate(560 310)">
              <path d="M0 32 C 0 32 -20 8 -20 -5 A20 20 0 1 1 20 -5 C 20 8 0 32 0 32 Z" fill="#C96B45" />
              <circle cy="-5" r="7" fill="#FDFBF7" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
