'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Pt = { x: number; y: number };
const ROUTE = 'M 70 255 C 160 250, 210 210, 300 215 C 390 220, 430 165, 520 150 C 610 135, 660 105, 720 92';

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1));
  return t * t * (3 - 2 * t);
}
function band(p: number, a: number, b: number, c: number, d: number) {
  return smoothstep(a, b, p) * (1 - smoothstep(c, d, p));
}

/**
 * Scroll-driven, 3D-style travel journey scene (Phase 16 hero signature).
 * Progress is tied to the hero section's scroll position (no scroll hijacking).
 * One consistent traveller moves source→destination through layered landscapes.
 */
export default function ImmersiveJourney({ sectionId = 'hero-journey' }: { sectionId?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [progress, setProgress] = useState(0);
  const [pos, setPos] = useState<Pt>({ x: 70, y: 255 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const prefers =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefers) {
      setReduced(true);
      setProgress(1);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const section = document.getElementById(sectionId);
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = rect.height - vh * 0.55;
      const p = total > 0 ? clamp(-rect.top / total) : 0;
      setProgress(p);
      const path = pathRef.current;
      if (path && path.getTotalLength) {
        const len = path.getTotalLength();
        const pt = path.getPointAtLength(len * p);
        setPos({ x: pt.x, y: pt.y });
      }
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
  }, [sectionId]);

  useEffect(() => {
    if (!reduced) return;
    const path = pathRef.current;
    if (path?.getTotalLength) {
      const pt = path.getPointAtLength(path.getTotalLength());
      setPos({ x: pt.x, y: pt.y });
    }
  }, [reduced]);

  const p = reduced ? 1 : progress;
  const sDeparture = band(p, -0.1, 0.0, 0.18, 0.32);
  const sMountains = band(p, 0.12, 0.28, 0.45, 0.58);
  const sCoast = band(p, 0.38, 0.52, 0.66, 0.78);
  const sCulture = band(p, 0.6, 0.72, 0.84, 0.92);
  const sArrival = smoothstep(0.78, 0.95, p);

  const skyTop = p < 0.5 ? '#E7F4F3' : p < 0.75 ? '#EAF3F6' : '#F6EFE6';
  const skyBottom = p < 0.5 ? '#F8F3EA' : p < 0.75 ? '#F3F7F5' : '#FDF7EE';
  const parallaxFar = (p - 0.5) * -18;
  const parallaxMid = (p - 0.5) * -34;
  const parallaxNear = (p - 0.5) * -52;

  const caption = useMemo(() => {
    if (p < 0.18) return { title: 'The beginning', text: 'A small start, a clear path ahead.' };
    if (p < 0.38) return { title: 'Into the journey', text: 'Roads open, landscapes unfold.' };
    if (p < 0.58) return { title: 'Mountains & nature', text: 'Discover places shaped by the wild.' };
    if (p < 0.76) return { title: 'Coast & culture', text: 'From warm shores to living history.' };
    return { title: 'Arrival', text: 'Some journeys lead you somewhere unforgettable.' };
  }, [p]);

  return (
    <div ref={wrapRef} className="relative h-full w-full" aria-hidden="true">
      <div
        className="relative overflow-hidden rounded-panel border border-ink-100/80 bg-white/70 shadow-panel ring-1 ring-ink-900/5"
        style={{ perspective: reduced ? undefined : '1400px' }}
      >
        <div
          className="relative aspect-[4/3] w-full sm:aspect-[16/11] lg:aspect-[5/4]"
          style={reduced ? undefined : { transform: `rotateX(${6 - p * 3}deg)`, transformStyle: 'preserve-3d' }}
        >
          <svg viewBox="0 0 800 360" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="j-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={skyTop} />
                <stop offset="100%" stopColor={skyBottom} />
              </linearGradient>
              <linearGradient id="j-mtn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9EC8C9" />
                <stop offset="100%" stopColor="#5FA6AA" />
              </linearGradient>
              <linearGradient id="j-mtn2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F6167" />
                <stop offset="100%" stopColor="#0B4A4F" />
              </linearGradient>
              <linearGradient id="j-sea" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7FBFC2" />
                <stop offset="100%" stopColor="#3B9BA0" />
              </linearGradient>
              <linearGradient id="j-road" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#C96B45" />
                <stop offset="100%" stopColor="#147A80" />
              </linearGradient>
            </defs>

            <rect width="800" height="360" fill="url(#j-sky)" />
            <circle cx={640 - p * 40} cy={70} r="34" fill="#E6CE93" opacity={0.85 - sCoast * 0.2} />

            <g transform={`translate(${parallaxFar} 0)`} opacity={0.55}>
              <ellipse cx="180" cy="120" rx="90" ry="22" fill="#fff" opacity="0.7" />
              <ellipse cx="520" cy="95" rx="110" ry="26" fill="#fff" opacity="0.55" />
            </g>

            <g transform={`translate(${parallaxMid} 0)`} opacity={0.25 + sMountains * 0.75 + sArrival * 0.15}>
              <path d="M0 250 L120 140 L210 230 L330 110 L450 240 L560 150 L700 220 L800 170 L800 360 L0 360 Z" fill="url(#j-mtn)" />
              <path d="M330 110 L370 165 L330 185 L290 165 Z" fill="#FDFBF7" opacity="0.7" />
            </g>

            <g opacity={sCoast * 0.9} transform={`translate(${parallaxMid * 0.6} ${12 - sCoast * 12})`}>
              <path d="M0 260 C 180 245, 320 275, 520 255 C 640 242, 720 260, 800 250 L800 360 L0 360 Z" fill="url(#j-sea)" opacity="0.55" />
              <path d="M0 285 C 160 272, 340 295, 520 282 C 660 270, 740 286, 800 278" stroke="#fff" strokeOpacity="0.5" strokeWidth="3" fill="none" />
              <path d="M0 300 C 200 288, 360 308, 560 296 C 700 286, 760 298, 800 292" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" fill="none" />
            </g>

            <g transform={`translate(${parallaxNear} 0)`}>
              <path d="M0 360 L0 265 C 140 235, 260 275, 420 250 C 560 228, 680 255, 800 235 L800 360 Z" fill="url(#j-mtn2)" opacity={0.18 + sMountains * 0.25} />
              <path d="M0 360 L0 285 C 160 255, 280 295, 430 272 C 600 245, 700 280, 800 262 L800 360 Z" fill="#0B4A4F" opacity="0.12" />
              <path d="M0 360 L0 300 C 150 275, 300 315, 460 292 C 620 268, 720 300, 800 286 L800 360 Z" fill="#8E7960" opacity={0.16 + sDeparture * 0.08} />
            </g>

            <g opacity={0.25 + sDeparture * 0.75} transform={`translate(${-p * 10} 0)`}>
              <g transform="translate(28 248)">
                <rect x="0" y="18" width="34" height="26" rx="3" fill="#F8F3EA" stroke="#CBB79B" />
                <path d="M-4 18 L17 2 L38 18 Z" fill="#C96B45" />
                <rect x="14" y="30" width="8" height="14" rx="1.5" fill="#B29B7C" />
                <rect x="5" y="24" width="6" height="6" rx="1" fill="#BCDDDE" />
              </g>
              <g fill="#0F6167" opacity="0.7">
                <rect x="92" y="250" width="4" height="22" rx="2" />
                <circle cx="94" cy="246" r="12" />
                <rect x="132" y="255" width="4" height="18" rx="2" />
                <circle cx="134" cy="252" r="10" />
              </g>
            </g>

            <g opacity={sCulture * 0.9 + sArrival * 0.5} transform={`translate(${40 - p * 10} 0)`}>
              <g transform="translate(560 232)">
                <path d="M0 40 L0 18 C0 8 10 0 22 0 C34 0 44 8 44 18 L44 40 Z" fill="#E8AE90" opacity="0.85" />
                <rect x="18" y="24" width="8" height="16" rx="2" fill="#98472A" opacity="0.6" />
                <path d="M22 -6 L22 -14" stroke="#C29B3C" strokeWidth="3" strokeLinecap="round" />
                <circle cx="22" cy="-16" r="3" fill="#C29B3C" />
              </g>
            </g>

            <path ref={pathRef} d={ROUTE} stroke="#0C1C2C" strokeOpacity="0.12" strokeWidth="12" strokeLinecap="round" fill="none" />
            <path d={ROUTE} stroke="url(#j-road)" strokeWidth="3.5" strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />

            {[0, 0.33, 0.66, 1].map((t) => (
              <Waypoint key={t} pathRef={pathRef} t={t} active={p >= t - 0.02} />
            ))}

            <g transform="translate(720 92)" opacity={0.45 + sArrival}>
              {!reduced && sArrival > 0.2 ? <circle r="16" fill="#C96B45" opacity={0.28} /> : null}
              <path d="M0 18 C 0 18 -12 4 -12 -4 A12 12 0 1 1 12 -4 C 12 4 0 18 0 18 Z" fill="#C96B45" />
              <circle cy="-4" r="4.5" fill="#FDFBF7" />
            </g>

            <g transform={`translate(${pos.x} ${pos.y})`}>
              <g transform="translate(-10 -30)">
                <ellipse cx="10" cy="31" rx="8" ry="2.5" fill="#0C1C2C" opacity="0.18" />
                <path d="M6 12 h10 a4 4 0 0 1 4 4 v8 h-18 v-8 a4 4 0 0 1 4 -4 z" fill="#C96B45" />
                <circle cx="11" cy="7.5" r="5" fill="#14303F" />
                <path d="M6.5 14 h9 v11 h-9 z" fill="#147A80" />
                <path d="M8.5 25 v7M13.5 25 v7" stroke="#14303F" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M3 16 l4 4M19 16 l-3 4" stroke="#14303F" strokeWidth="2.2" strokeLinecap="round" />
              </g>
            </g>
          </svg>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <div className="inline-flex max-w-[18rem] flex-col rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-soft backdrop-blur-sm">
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-sea-700">{caption.title}</span>
              <span className="mt-1 text-sm font-medium leading-snug text-ink-800">{caption.text}</span>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-ink-400">Scroll to travel the route.</p>
    </div>
  );
}

function Waypoint({
  pathRef,
  t,
  active,
}: {
  pathRef: React.RefObject<SVGPathElement | null>;
  t: number;
  active: boolean;
}) {
  const [pt, setPt] = useState<Pt | null>(null);
  useEffect(() => {
    const path = pathRef.current;
    if (!path?.getTotalLength) return;
    const p = path.getPointAtLength(path.getTotalLength() * t);
    setPt({ x: p.x, y: p.y });
  }, [pathRef, t]);
  if (!pt) return null;
  return <circle cx={pt.x} cy={pt.y} r={5} fill={active ? '#147A80' : '#FDFBF7'} stroke="#147A80" strokeWidth={2.5} />;
}
