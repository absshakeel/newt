import { DestinationCard } from '@/components/destinations/DestinationCard';
import { EmptyState, ErrorState } from '@gtour/ui';
import { ButtonLink } from '@gtour/ui';
import { Reveal } from '@gtour/ui';
import { Section, SectionHeading } from './Section';
import type { DestinationDto } from '@gtour/utils';

/**
 * Section 1 — Popular Destinations.
 * Editorial asymmetric composition: one feature destination plus a supporting
 * pair, then a row of compact tiles. Renders real API data only.
 */
export default function PopularDestinations({
  destinations,
  error,
}: {
  destinations: DestinationDto[];
  error?: string;
}) {
  const [feature, ...rest] = destinations;
  const supporting = rest.slice(0, 2);
  const compact = rest.slice(2, 5);

  return (
    <Section id="destinations" className="pt-4 sm:pt-6 lg:pt-10">
      <SectionHeading
        eyebrow="Popular right now"
        title="Places worth the journey"
        description="Hand-picked destinations from our catalogue, from island coastlines to high mountain passes."
        action={{ href: '/destinations', label: 'All destinations' }}
      />

      <div className="mt-10">
        {error ? (
          <ErrorState
            compact
            title="Destinations are taking a moment"
            description="We couldn’t load the latest destinations right now. Try browsing the full list."
          />
        ) : !feature ? (
          <EmptyState
            compact
            title="New destinations coming soon"
            description="We’re curating places for you. In the meantime, explore by travel style below."
            action={<ButtonLink href="/destinations" variant="outline" size="sm">Browse destinations</ButtonLink>}
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-12">
            <Reveal className="sm:col-span-2 lg:col-span-7">
              <DestinationCard
                destination={feature}
                priority
                imageClassName="aspect-[4/3] sm:aspect-[16/11]"
                sizes="(min-width: 1024px) 58vw, 100vw"
              />
            </Reveal>

            <div className="grid gap-5 sm:col-span-2 lg:col-span-5">
              {supporting.map((destination, index) => (
                <Reveal key={destination._id} delayMs={index * 90}>
                  <DestinationCard
                    destination={destination}
                    compact
                    imageClassName="aspect-[16/10]"
                    sizes="(min-width: 1024px) 34vw, 100vw"
                  />
                </Reveal>
              ))}
            </div>

            {compact.length > 0 ? (
              <div className="grid gap-5 sm:col-span-2 sm:grid-cols-3 lg:col-span-12">
                {compact.map((destination, index) => (
                  <Reveal key={destination._id} delayMs={index * 80}>
                    <DestinationCard
                      destination={destination}
                      compact
                      imageClassName="aspect-[4/3]"
                      sizes="(min-width: 640px) 33vw, 100vw"
                    />
                  </Reveal>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </Section>
  );
}