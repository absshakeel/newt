import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@gtour/ui';
import { images } from '@/lib/images';
import { Section, SectionHeading } from './Section';
import { cn } from '@gtour/utils';

/** Section E — Complete Your Journey: three services, distinct compositions (Phase 16). */
const SERVICES = [
  {
    title: 'Hotels',
    blurb: 'Comfortable stays, from city rooms to coastal resorts.',
    href: '/hotels',
    cta: 'Browse stays',
    src: images.services.hotel.src,
    alt: images.services.hotel.alt,
  },
  {
    title: 'Photographers',
    blurb: 'Local photographers who know the light and the moment.',
    href: '/photographers',
    cta: 'Meet photographers',
  },
  {
    title: 'Vehicles',
    blurb: 'The right transport for your route, when you need it.',
    href: '/vehicles',
    cta: 'See vehicles',
  },
] as const;

function ServiceIllustration({ title }: { title: string }) {
  if (title === 'Photographers') {
    return (
      <div className="relative flex h-full min-h-[11rem] items-center justify-center overflow-hidden bg-gradient-to-br from-sea-700 via-sea-600 to-ocean-700 sm:min-h-full">
        <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
        <div className="absolute -bottom-10 -right-6 h-36 w-36 rounded-full bg-gold-400/20 blur-2xl" aria-hidden="true" />
        <svg viewBox="0 0 220 180" className="relative h-28 w-auto text-white/95 drop-shadow-sm sm:h-32" fill="none" aria-hidden="true">
          <rect x="34" y="58" width="152" height="92" rx="18" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="3" />
          <path d="M78 58l10-18h44l10 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="110" cy="104" r="28" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.12" />
          <circle cx="110" cy="104" r="14" stroke="currentColor" strokeWidth="3" />
          <rect x="150" y="70" width="18" height="10" rx="4" fill="currentColor" fillOpacity="0.35" />
          <path d="M26 42l10 6M194 42l-10 6M110 28v12" stroke="currentColor" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  return (
    <div className="relative flex h-full min-h-[11rem] items-center justify-center overflow-hidden bg-gradient-to-br from-gold-500 via-gold-400 to-terracotta-500 sm:min-h-full">
      <div className="absolute -left-6 top-6 h-28 w-28 rounded-full bg-white/20 blur-2xl" aria-hidden="true" />
      <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-sea-700/20 blur-2xl" aria-hidden="true" />
      <svg viewBox="0 0 240 160" className="relative h-28 w-auto text-ink-900/90 drop-shadow-sm sm:h-32" fill="none" aria-hidden="true">
        <path d="M28 108h184" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <rect x="42" y="54" width="118" height="44" rx="10" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="3" />
        <path d="M160 72h28l18 18v18h-46V72Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M56 54V40h84v14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="64" y="62" width="22" height="16" rx="3" fill="white" fillOpacity="0.35" stroke="currentColor" strokeWidth="2" />
        <rect x="92" y="62" width="22" height="16" rx="3" fill="white" fillOpacity="0.35" stroke="currentColor" strokeWidth="2" />
        <rect x="120" y="62" width="22" height="16" rx="3" fill="white" fillOpacity="0.35" stroke="currentColor" strokeWidth="2" />
        <circle cx="78" cy="108" r="14" fill="white" fillOpacity="0.4" stroke="currentColor" strokeWidth="3" />
        <circle cx="176" cy="108" r="14" fill="white" fillOpacity="0.4" stroke="currentColor" strokeWidth="3" />
        <circle cx="78" cy="108" r="5" fill="currentColor" fillOpacity="0.5" />
        <circle cx="176" cy="108" r="5" fill="currentColor" fillOpacity="0.5" />
      </svg>
    </div>
  );
}

export default function CompleteJourney() {
  const [feature, ...rest] = SERVICES;
  return (
    <Section className="bg-sand-100">
      <SectionHeading
        eyebrow="Beyond the destination"
        title="Complete your journey"
        description="A place to stay, someone to capture it, and a way to move — each with its own path."
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <Link
            href={feature.href}
            className="group relative isolate flex min-h-[22rem] overflow-hidden rounded-panel bg-ink-900 shadow-soft transition-shadow duration-300 ease-premium hover:shadow-lift sm:min-h-[26rem]"
          >
            <Image
              src={feature.src}
              alt={feature.alt}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-ink-veil" aria-hidden="true" />
            <div className="relative mt-auto p-7 sm:p-9">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-sand-300">Stay</p>
              <h3 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">{feature.title}</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-sand-200/90">{feature.blurb}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                {feature.cta}
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 stroke-current transition-transform duration-300 ease-premium group-hover:translate-x-1" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </Link>
        </Reveal>

        <div className="grid gap-5 lg:col-span-5">
          {rest.map((service, index) => (
            <Reveal key={service.title} delayMs={index * 90}>
              <Link
                href={service.href}
                className={cn(
                  'group grid h-full overflow-hidden rounded-panel bg-white shadow-soft transition-shadow duration-300 ease-premium hover:shadow-lift sm:grid-cols-[0.95fr_1.05fr]',
                  index === 1 && 'sm:grid-cols-[1.05fr_0.95fr]'
                )}
              >
                <div className={cn('relative min-h-[11rem] sm:min-h-full', index === 1 && 'sm:order-2')}>
                  <ServiceIllustration title={service.title} />
                </div>
                <div className={cn('flex flex-col justify-center p-6', index === 1 && 'sm:order-1')}>
                  <h3 className="font-display text-2xl font-semibold text-ink-900">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{service.blurb}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sea-600">
                    {service.cta}
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 stroke-current transition-transform duration-300 ease-premium group-hover:translate-x-1" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}