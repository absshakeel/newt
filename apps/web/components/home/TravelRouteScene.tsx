'use client';

import { useEffect, useState } from 'react';

const ROUTE_PATH = 'M28 214 C 132 208, 168 140, 268 148 S 392 196, 470 138 S 596 60, 700 76';

const WAYPOINTS = [
  { cx: 132, cy: 202 },
  { cx: 268, cy: 148 },
  { cx: 470, cy: 138 },
];

/**
 * Illustrated travel story used in the hero: a route draws itself across
 * stylised scenery while a traveller marker walks toward the destination.
 * Purely decorative (aria-hidden) and fully static under reduced motion.
 */
export default function TravelRouteScene({ className }: { className?: string }) {
  const [revealed, setRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setReducedMotion(true);
      setRevealed(true);
      return;
    }

    const frame = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <svg
      viewBox="0 0 760 300"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id="gtour-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E3F1F1" />
          <stop offset="100%" stopColor="#F8F3EA" />
        </linearGradient>
        <linearGradient id="gtour-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BCDDDE" />
          <stop offset="100%" stopColor="#7FBFC2" />
        </linearGradient>
        <linearGradient id="gtour-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0F6167" />
          <stop offset="100%" stopColor="#0B4A4F" />
        </linearGradient>
        <linearGradient id="gtour-dune" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8AE90" />
          <stop offset="100%" stopColor="#C96B45" />
        </linearGradient>
        <linearGradient id="gtour-route" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C96B45" />
          <stop offset="100%" stopColor="#147A80" />
        </linearGradient>
      </defs>

      <rect width="760" height="300" rx="28" fill="url(#gtour-sky)" />

      <circle cx="648" cy="60" r="30" fill="#E6CE93" opacity="0.85" />

      <g className={reducedMotion ? undefined : 'animate-drift'}>
        <path d="M96 74c8-16 32-18 42-6 14-8 34 0 34 14H82c0-6 6-8 14-8z" fill="#FFFFFF" />
        <path
          d="M420 48c7-13 27-15 35-5 12-6 28 0 28 12H410c0-5 5-7 10-7z"
          fill="#FFFFFF"
          opacity="0.75"
        />
      </g>

      <g
        className={reducedMotion ? undefined : 'animate-drift'}
        stroke="#14303F"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      >
        <path d="M300 92c5-5 9-5 14 0M318 84c4-4 8-4 12 0" />
      </g>

      <path d="M0 232 L120 158 L212 226 L318 132 L430 232 Z" fill="url(#gtour-far)" />
      <path d="M318 132 L368 180 L318 200 L272 180 Z" fill="#FDFBF7" opacity="0.8" />

      <path
        d="M0 268 C 120 232, 216 268, 330 244 C 452 218, 566 258, 760 226 L760 300 L0 300 Z"
        fill="url(#gtour-dune)"
        opacity="0.45"
      />

      <path
        d="M0 300 L0 252 C 140 214, 236 262, 372 240 C 512 216, 616 254, 760 232 L760 300 Z"
        fill="url(#gtour-near)"
      />

      <path
        d={ROUTE_PATH}
        stroke="#0C1C2C"
        strokeOpacity="0.12"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d={ROUTE_PATH}
        pathLength={1}
        className="gtour-route-path"
        data-revealed={revealed}
        stroke="url(#gtour-route)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {WAYPOINTS.map((point) => (
        <circle
          key={`${point.cx}-${point.cy}`}
          cx={point.cx}
          cy={point.cy}
          r="5.5"
          fill="#FDFBF7"
          stroke="#147A80"
          strokeWidth="2.5"
        />
      ))}

      <g transform="translate(700 76)">
        {reducedMotion ? null : (
          <circle
            r="14"
            fill="#C96B45"
            opacity="0.35"
            style={{ transformOrigin: 'center' }}
            className="animate-pulse-marker"
          />
        )}
        <path
          d="M0 18 C 0 18 -12 4 -12 -4 A12 12 0 1 1 12 -4 C 12 4 0 18 0 18 Z"
          fill="#C96B45"
        />
        <circle cy="-4" r="4.6" fill="#FDFBF7" />
      </g>

      <g>
        {reducedMotion ? (
          <g transform="translate(700 76)">
            <Traveller />
          </g>
        ) : (
          <g>
            <animateMotion
              dur="12s"
              repeatCount="indefinite"
              path={ROUTE_PATH}
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="linear"
              rotate="0"
            />
            <Traveller />
          </g>
        )}
      </g>
    </svg>
  );
}

function Traveller() {
  return (
    <g transform="translate(-11 -32)">
      <path d="M8 13 h9 a4 4 0 0 1 4 4 v9 h-17 v-9 a4 4 0 0 1 4 -4 z" fill="#C96B45" />
      <circle cx="12.5" cy="8" r="5.2" fill="#14303F" />
      <path d="M8.5 15 h8 v12 h-8 z" fill="#147A80" />
      <path d="M10 27 v8M15.5 27 v8" stroke="#14303F" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M17 19 l6 3" stroke="#14303F" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  );
}