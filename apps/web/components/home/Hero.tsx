import Image from 'next/image';
import HeroSearch from './HeroSearch';
import { images } from '@/lib/images';
import { ButtonLink } from '@gtour/ui';
import type { PopulatedCategory, PopulatedLocation } from '@gtour/utils';

export default function Hero({
  categories = [],
  locations = [],
}: {
  categories?: PopulatedCategory[];
  locations?: PopulatedLocation[];
}) {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink-950 py-14 sm:py-16 lg:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image
          src={images.hero.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover scale-[1.03] motion-safe:animate-[gtour-float-slow_22s_ease-in-out_infinite]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(6,16,28,0.88)_0%,rgba(6,16,28,0.72)_38%,rgba(6,16,28,0.38)_68%,rgba(6,16,28,0.55)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_20%,rgba(59,155,160,0.28),transparent_38%),radial-gradient(ellipse_at_78%_30%,rgba(230,206,147,0.16),transparent_34%),radial-gradient(ellipse_at_70%_80%,rgba(201,107,69,0.2),transparent_36%)]" />
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-sea-400/20 blur-3xl motion-safe:animate-[gtour-float_14s_ease-in-out_infinite]" />
        <div className="absolute right-[-5rem] top-1/3 h-80 w-80 rounded-full bg-gold-300/15 blur-3xl motion-safe:animate-[gtour-drift_18s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-4rem] left-1/3 h-72 w-72 rounded-full bg-terracotta-400/20 blur-3xl motion-safe:animate-[gtour-float-slow_16s_ease-in-out_infinite]" />
      </div>

      <div className="gtour-container relative z-10 w-full">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="max-w-2xl motion-safe:animate-[gtour-fade-up_700ms_cubic-bezier(0.22,1,0.36,1)_both]">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white shadow-soft backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-300 shadow-[0_0_12px_rgba(230,206,147,0.9)] motion-safe:animate-[pulse_2.2s_ease-in-out_infinite]" />
              Global Tourism Platform
            </p>

            <h1 className="mt-6 text-balance font-display text-[clamp(2.6rem,5.2vw,4.8rem)] font-semibold leading-[1.01] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
              Discover beautiful places
              <span className="mt-1 block bg-[linear-gradient(90deg,#E7F4F3,#E6CE93,#F8F3EA,#BCDDDE)] bg-[length:220%_220%] bg-clip-text text-transparent motion-safe:animate-[gtour-shimmer_8s_ease_infinite]">
                and plan your next journey.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-sand-50/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)] sm:text-lg">
              Explore destinations, find stays, and connect with travel services — all in one place. Start by choosing where you want to go.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/destinations" size="lg" className="bg-sand-50 text-ink-900 shadow-soft hover:bg-white">
                Explore destinations
              </ButtonLink>
              <ButtonLink href="/hotels" variant="outline" size="lg" className="border-white/45 bg-white/10 text-white backdrop-blur-sm hover:border-white/70 hover:bg-white/20">
                Find your stay
              </ButtonLink>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-white/25 bg-white/95 p-3 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-4 motion-safe:animate-[gtour-scale-in_900ms_120ms_cubic-bezier(0.22,1,0.36,1)_both]">
              <HeroSearch categories={categories} locations={locations} />
              <p className="mt-3 px-1 text-xs leading-relaxed text-ink-500">
                Search by place, travel style, or region to find destinations that match your plans.
              </p>
            </div>
          </div>

          <div className="relative min-h-[22rem] motion-safe:animate-[gtour-fade-up_800ms_120ms_cubic-bezier(0.22,1,0.36,1)_both] sm:min-h-[26rem] lg:min-h-[35rem]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              {/* ambient auras */}
              <div className="absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sea-400/15 blur-3xl motion-safe:animate-[gtour-float-slow_14s_ease-in-out_infinite] sm:h-[24rem] sm:w-[24rem]" />
              <div className="absolute right-[8%] top-[12%] h-32 w-32 rounded-full bg-gold-300/20 blur-2xl motion-safe:animate-[gtour-float_12s_ease-in-out_infinite]" />
              <div className="absolute bottom-[8%] left-[8%] h-36 w-36 rounded-full bg-terracotta-300/20 blur-2xl motion-safe:animate-[gtour-drift_16s_ease-in-out_infinite]" />

              {/* subtle orbit */}
              <div className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 sm:h-[28rem] sm:w-[28rem] lg:h-[34rem] lg:w-[34rem]" />
              <div className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full motion-safe:animate-[spin_30s_linear_infinite] sm:h-[28rem] sm:w-[28rem] lg:h-[34rem] lg:w-[34rem]">
                <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sea-100 shadow-[0_0_18px_rgba(188,221,222,0.95)]" />
              </div>
              <div className="absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10 motion-safe:animate-[spin_22s_linear_infinite_reverse] sm:h-[23rem] sm:w-[23rem] lg:h-[28rem] lg:w-[28rem]" />

              {/* professional globe */}
              <div className="absolute left-1/2 top-1/2 aspect-square w-[21rem] -translate-x-1/2 -translate-y-1/2 sm:w-[27rem] lg:w-[33rem]">
                <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible drop-shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
                  <defs>
                    <radialGradient id="globeSphere" cx="32%" cy="28%" r="78%">
                      <stop offset="0%" stopColor="#D6F4F1" />
                      <stop offset="28%" stopColor="#4FAEB8" />
                      <stop offset="58%" stopColor="#1D6E7A" />
                      <stop offset="100%" stopColor="#0A3340" />
                    </radialGradient>
                    <radialGradient id="globeHighlight" cx="28%" cy="24%" r="34%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </radialGradient>
                    <radialGradient id="globeShadow" cx="72%" cy="78%" r="58%">
                      <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.32)" />
                    </radialGradient>
                    <linearGradient id="routeGradPro" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="45%" stopColor="#F2DDAA" />
                      <stop offset="100%" stopColor="#FFC9A8" />
                    </linearGradient>
                    <clipPath id="globeClip">
                      <circle cx="200" cy="200" r="168" />
                    </clipPath>
                    <filter id="glowPro">
                      <feGaussianBlur stdDeviation="4.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* atmosphere */}
                  <circle cx="200" cy="200" r="188" fill="rgba(188,221,222,0.08)" className="motion-safe:animate-[pulse_5s_ease-in-out_infinite]" />
                  <circle cx="200" cy="200" r="178" fill="none" stroke="rgba(231,244,243,0.22)" strokeWidth="2" />
                  <circle cx="200" cy="200" r="182" fill="none" stroke="rgba(230,206,147,0.12)" strokeWidth="1.5" strokeDasharray="6 10" className="motion-safe:animate-[spin_40s_linear_infinite]" />

                  {/* sphere */}
                  <circle cx="200" cy="200" r="168" fill="url(#globeSphere)" />
                  <g clipPath="url(#globeClip)">
                    {/* graticule */}
                    <g stroke="rgba(253,251,247,0.14)" strokeWidth="1" fill="none" className="motion-safe:[transform-origin:200px_200px] motion-safe:animate-[spin_60s_linear_infinite]">
                      <ellipse cx="200" cy="200" rx="168" ry="38" />
                      <ellipse cx="200" cy="200" rx="168" ry="74" />
                      <ellipse cx="200" cy="200" rx="168" ry="112" />
                      <ellipse cx="200" cy="200" rx="168" ry="142" />
                      <ellipse cx="200" cy="200" rx="38" ry="168" />
                      <ellipse cx="200" cy="200" rx="74" ry="168" />
                      <ellipse cx="200" cy="200" rx="112" ry="168" />
                      <ellipse cx="200" cy="200" rx="142" ry="168" />
                    </g>
                    <g stroke="rgba(253,251,247,0.08)" strokeWidth="1" fill="none" className="motion-safe:[transform-origin:200px_200px] motion-safe:animate-[spin_45s_linear_infinite_reverse]">
                      <ellipse cx="200" cy="200" rx="168" ry="56" />
                      <ellipse cx="200" cy="200" rx="168" ry="94" />
                      <ellipse cx="200" cy="200" rx="56" ry="168" />
                      <ellipse cx="200" cy="200" rx="94" ry="168" />
                    </g>

                    {/* inner animated routes */}
                    <path
                      id="globeRoutePath"
                      d="M70 245 C 125 165, 225 135, 320 185"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="11"
                      strokeLinecap="round"
                      filter="url(#glowPro)"
                    />
                    <path
                      d="M70 245 C 125 165, 225 135, 320 185"
                      fill="none"
                      stroke="url(#routeGradPro)"
                      strokeWidth="5.5"
                      strokeLinecap="round"
                      strokeDasharray="12 14"
                      className="motion-safe:animate-[gtour-shimmer_6s_linear_infinite]"
                    />
                    <path
                      d="M105 210 C 160 140, 250 165, 295 235"
                      fill="none"
                      stroke="rgba(253,251,247,0.5)"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeDasharray="4 10"
                      className="motion-safe:animate-[gtour-shimmer_9s_linear_infinite_reverse]"
                      opacity="0.85"
                    />

                    <g>
                      <circle cx="70" cy="245" r="7.5" fill="#FDFBF7" />
                      <circle cx="70" cy="245" r="17" fill="#FDFBF7" opacity="0.18" className="motion-safe:animate-[pulse_2.8s_ease-in-out_infinite]" />
                    </g>

                    <g transform="translate(320 185)">
                      <path d="M0 22 C 0 22 -15 4 -15 -6 A15 15 0 1 1 15 -6 C 15 4 0 22 0 22 Z" fill="#F3D2C1" />
                      <circle cy="-6" r="5.5" fill="#0C1C2C" />
                      <circle r="22" fill="#F3D2C1" opacity="0.16" className="motion-safe:animate-[pulse_3s_ease-in-out_infinite]" />
                    </g>

                    <g>
                      {/* source -> destination */}
                      <g>
                        <animateMotion
                          dur="16s"
                          repeatCount="indefinite"
                          rotate="auto"
                          calcMode="spline"
                          keyPoints="0;1;1"
                          keyTimes="0;0.5;1"
                          keySplines="0.42 0 0.58 1;0 0 1 1"
                        >
                          <mpath href="#globeRoutePath" />
                        </animateMotion>
                        <g>
                          <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.5;0.5;1" dur="16s" repeatCount="indefinite" />
                          <g transform="translate(-30 0) scale(1.05)">
                            {/* professional airplane */}
                            <ellipse cx="22" cy="0" rx="24" ry="5.2" fill="#FDFBF7" />
                            <path d="M42 0 C 50 0, 54 -1.2, 58 0 C 54 1.2, 50 0, 42 0 Z" fill="#E6CE93" />
                            <path d="M14 -1 L-6 -15 L-2 -1 Z" fill="#FFFFFF" opacity="0.98" />
                            <path d="M14 1 L-6 15 L-2 1 Z" fill="#E7F4F3" opacity="0.98" />
                            <path d="M30 -1 L22 -9 L20 -1 Z" fill="#FFFFFF" opacity="0.95" />
                            <path d="M30 1 L22 9 L20 1 Z" fill="#E7F4F3" opacity="0.95" />
                            <rect x="12" y="-1.8" width="18" height="3.6" rx="1.8" fill="#BCDDDE" opacity="0.9" />
                            <circle cx="10" cy="0" r="1.4" fill="#147A80" opacity="0.9" />
                            <circle cx="16" cy="0" r="1.2" fill="#147A80" opacity="0.75" />
                            <circle cx="22" cy="0" r="1.2" fill="#147A80" opacity="0.75" />
                          </g>
                        </g>
                      </g>

                      {/* destination -> source (head facing travel direction) */}
                      <g>
                        <animateMotion
                          dur="16s"
                          repeatCount="indefinite"
                          rotate="auto"
                          calcMode="spline"
                          keyPoints="1;1;0"
                          keyTimes="0;0.5;1"
                          keySplines="0 0 1 1;0.42 0 0.58 1"
                        >
                          <mpath href="#globeRoutePath" />
                        </animateMotion>
                        <g>
                          <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.5;0.5;1" dur="16s" repeatCount="indefinite" />
                          <g transform="translate(-30 0) scale(-1.05,1.05)">
                            {/* professional airplane (flipped to face return direction) */}
                            <ellipse cx="22" cy="0" rx="24" ry="5.2" fill="#FDFBF7" />
                            <path d="M42 0 C 50 0, 54 -1.2, 58 0 C 54 1.2, 50 0, 42 0 Z" fill="#E6CE93" />
                            <path d="M14 -1 L-6 -15 L-2 -1 Z" fill="#FFFFFF" opacity="0.98" />
                            <path d="M14 1 L-6 15 L-2 1 Z" fill="#E7F4F3" opacity="0.98" />
                            <path d="M30 -1 L22 -9 L20 -1 Z" fill="#FFFFFF" opacity="0.95" />
                            <path d="M30 1 L22 9 L20 1 Z" fill="#E7F4F3" opacity="0.95" />
                            <rect x="12" y="-1.8" width="18" height="3.6" rx="1.8" fill="#BCDDDE" opacity="0.9" />
                            <circle cx="10" cy="0" r="1.4" fill="#147A80" opacity="0.9" />
                            <circle cx="16" cy="0" r="1.2" fill="#147A80" opacity="0.75" />
                            <circle cx="22" cy="0" r="1.2" fill="#147A80" opacity="0.75" />
                          </g>
                        </g>
                      </g>
                    </g>

                    <g opacity="0.9">
                      <circle cx="160" cy="205" r="5" fill="#E6CE93" className="motion-safe:animate-[pulse_3.2s_ease-in-out_infinite]" />
                      <circle cx="235" cy="160" r="4.5" fill="#FFFFFF" className="motion-safe:animate-[pulse_2.6s_ease-in-out_infinite]" />
                      <circle cx="210" cy="250" r="4" fill="#BCDDDE" className="motion-safe:animate-[pulse_3.6s_ease-in-out_infinite]" />
                    </g>
                  </g>

                  {/* lighting */}
                  <circle cx="200" cy="200" r="168" fill="url(#globeHighlight)" />
                  <circle cx="200" cy="200" r="168" fill="url(#globeShadow)" />
                  <circle cx="200" cy="200" r="168" fill="none" stroke="rgba(253,251,247,0.3)" strokeWidth="2" />
                </svg>
              </div>

              {/* extra animated elements */}
              <div className="absolute left-[10%] top-[10%] h-16 w-28 rounded-full bg-white/10 blur-[1px] motion-safe:animate-[gtour-float-slow_13s_ease-in-out_infinite]" />
              <div className="absolute left-[14%] top-[12%] h-10 w-20 rounded-full bg-white/15 blur-[1px] motion-safe:animate-[gtour-float_11s_ease-in-out_infinite]" />
              <div className="absolute right-[8%] top-[14%] h-14 w-24 rounded-full bg-white/10 blur-[1px] motion-safe:animate-[gtour-float-slow_15s_ease-in-out_infinite]" />
              <div className="absolute right-[12%] bottom-[12%] h-12 w-22 rounded-full bg-white/10 blur-[1px] motion-safe:animate-[gtour-float_12s_ease-in-out_infinite]" />

              <div className="absolute left-[18%] top-[26%] motion-safe:animate-[gtour-float_9s_ease-in-out_infinite]">
                <svg width="26" height="34" viewBox="0 0 26 34" className="drop-shadow-[0_6px_14px_rgba(0,0,0,0.25)]">
                  <path d="M13 33 C13 33 1 19 1 11 A12 12 0 1 1 25 11 C25 19 13 33 13 33 Z" fill="#F3D2C1" />
                  <circle cx="13" cy="11" r="4.5" fill="#0C1C2C" />
                </svg>
              </div>
              <div className="absolute right-[16%] top-[30%] motion-safe:animate-[gtour-float-slow_10s_ease-in-out_infinite]">
                <svg width="22" height="28" viewBox="0 0 26 34" className="drop-shadow-[0_6px_14px_rgba(0,0,0,0.25)] opacity-90">
                  <path d="M13 33 C13 33 1 19 1 11 A12 12 0 1 1 25 11 C25 19 13 33 13 33 Z" fill="#BCDDDE" />
                  <circle cx="13" cy="11" r="4.5" fill="#0C1C2C" />
                </svg>
              </div>
              <div className="absolute right-[22%] bottom-[24%] motion-safe:animate-[gtour-drift_12s_ease-in-out_infinite]">
                <svg width="24" height="30" viewBox="0 0 26 34" className="drop-shadow-[0_6px_14px_rgba(0,0,0,0.25)]">
                  <path d="M13 33 C13 33 1 19 1 11 A12 12 0 1 1 25 11 C25 19 13 33 13 33 Z" fill="#E6CE93" />
                  <circle cx="13" cy="11" r="4.5" fill="#0C1C2C" />
                </svg>
              </div>

              <div className="absolute left-[24%] bottom-[18%] motion-safe:animate-[gtour-float-slow_11s_ease-in-out_infinite]">
                <svg width="42" height="42" viewBox="0 0 42 42" className="opacity-90 drop-shadow-[0_6px_14px_rgba(0,0,0,0.2)]">
                  <path d="M4 20 C10 10, 18 10, 21 20 C24 10, 32 10, 38 20 C32 22, 28 28, 21 30 C14 28, 10 22, 4 20 Z" fill="#FDFBF7" />
                  <path d="M21 20 L21 38" stroke="#FDFBF7" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="absolute right-[28%] top-[44%] motion-safe:animate-[gtour-float_13s_ease-in-out_infinite]">
                <svg width="34" height="34" viewBox="0 0 34 34" className="opacity-80 drop-shadow-[0_6px_14px_rgba(0,0,0,0.2)]">
                  <path d="M17 4 L20 13 L30 13 L22 19 L25 29 L17 23 L9 29 L12 19 L4 13 L14 13 Z" fill="#E6CE93" />
                </svg>
              </div>

              {/* sparkles */}
              <div className="absolute left-[24%] top-[42%] h-2 w-2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] motion-safe:animate-[pulse_2.4s_ease-in-out_infinite]" />
              <div className="absolute right-[22%] top-[46%] h-2 w-2 rounded-full bg-gold-200 shadow-[0_0_12px_rgba(230,206,147,0.9)] motion-safe:animate-[pulse_3s_ease-in-out_infinite]" />
              <div className="absolute left-[42%] bottom-[28%] h-2.5 w-2.5 rounded-full bg-sea-100 shadow-[0_0_14px_rgba(188,221,222,0.9)] motion-safe:animate-[pulse_2.8s_ease-in-out_infinite]" />
              <div className="absolute left-[34%] top-[18%] h-2 w-2 rounded-full bg-terracotta-100 shadow-[0_0_12px_rgba(243,210,193,0.9)] motion-safe:animate-[pulse_3.4s_ease-in-out_infinite]" />
              <div className="absolute right-[34%] bottom-[18%] h-2 w-2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.85)] motion-safe:animate-[pulse_2.6s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}