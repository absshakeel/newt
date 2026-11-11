import { HotelCard } from '@/components/hotels/HotelCard';
import { ButtonLink } from '@gtour/ui';
import { EmptyState, ErrorState } from '@gtour/ui';
import { Reveal } from '@gtour/ui';
import { Section, SectionHeading } from './Section';
import type { HotelDto } from '@gtour/utils';

/**
 * Section 3 — Find Your Perfect Stay. Renders live hotel records. No prices or
 * ratings are invented; unavailable fields simply are not shown.
 */
export default function PerfectStay({
  hotels,
  error,
}: {
  hotels: HotelDto[];
  error?: string;
}) {
  return (
    <Section id="stays">
      <SectionHeading
        eyebrow="Where to sleep"
        title="Find your perfect stay"
        description="Properties added by hotel owners, with the details they published themselves."
        action={{ href: '/hotels', label: 'All hotels' }}
      />

      <div className="mt-10">
        {error ? (
          <ErrorState
            compact
            title="Stays are loading slowly"
            description="We couldn’t reach live stays right now. You can keep exploring destinations while we reconnect."
          />
        ) : hotels.length === 0 ? (
          <EmptyState
            compact
            title="Stays coming soon"
            description="No published properties yet. Explore destinations now, or list a property if you’re a host."
            action={
              <div className="flex flex-wrap items-center justify-center gap-3">
                <ButtonLink href="/destinations" variant="outline" size="sm">Explore destinations</ButtonLink>
                <ButtonLink href="/register?role=hotel_owner" variant="ghost" size="sm">List your property</ButtonLink>
              </div>
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.slice(0, 3).map((hotel, index) => (
              <Reveal key={hotel._id} delayMs={index * 80}>
                <HotelCard hotel={hotel} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}