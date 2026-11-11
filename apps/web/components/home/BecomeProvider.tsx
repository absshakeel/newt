import { ButtonLink } from '@gtour/ui';
import { Reveal } from '@gtour/ui';
import { Section, SectionHeading } from './Section';

const PROVIDER_TYPES = [
  {
    title: 'Hotel owners',
    copy: 'Publish rooms, capacity and amenities, then manage availability from one dashboard.',
  },
  {
    title: 'Photographers',
    copy: 'List your portfolio and services so travellers can book the right shoot.',
  },
  {
    title: 'Vehicle providers',
    copy: 'Offer cars, vans and drivers with per-day pricing and date-range availability.',
  },
];

const BENEFITS = [
  'Reach travellers already browsing your destination',
  'One dashboard for availability and pricing',
  'Reviews and ratings tied to real bookings',
];

/** Section 6 — Become a Travel Service Provider. */
export default function BecomeProvider() {
  return (
    <Section id="provider">
      <div className="overflow-hidden rounded-panel border border-ink-100 bg-white shadow-soft">
        <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:p-14">
          <div>
            <p className="gtour-eyebrow">For providers</p>
            <h2 className="mt-3 text-balance font-display text-display-sm font-semibold text-ink-900">
              Turn your local expertise into bookings.
            </h2>
            <p className="mt-4 max-w-lg text-pretty text-base leading-relaxed text-ink-500">
              Join the platform as a hotel owner, photographer or vehicle provider and reach
              travellers while they are still deciding where to go.
            </p>

            <ul className="mt-7 space-y-3">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm text-ink-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sea-100 text-sea-700">
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3 w-3 stroke-current" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12l5 5L20 6" />
                    </svg>
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/register?role=provider" size="lg">
                Become a provider
              </ButtonLink>
              <ButtonLink href="/login" variant="outline" size="lg">
                Provider sign in
              </ButtonLink>
            </div>
          </div>

          <ul className="space-y-3">
            {PROVIDER_TYPES.map((type, index) => (
              <Reveal as="li" key={type.title} delayMs={index * 80}>
                <div className="rounded-card border border-ink-100 bg-sand-50 p-5 transition-colors duration-300 hover:border-sea-300">
                  <h3 className="font-display text-lg font-semibold text-ink-900">{type.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{type.copy}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}