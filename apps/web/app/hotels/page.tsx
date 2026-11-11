import type { Metadata } from 'next';
import { HotelCard } from '@/components/hotels/HotelCard';
import { SectionHeading } from '@/components/home/Section';
import { ButtonLink } from '@gtour/ui';
import { EmptyState, ErrorState } from '@gtour/ui';
import { Reveal } from '@gtour/ui';
import { fetchHotels } from '@/lib/server-api';

export const revalidate = 120;

export const metadata: Metadata = {
  title: 'Hotels & stays',
  description:
    'Browse accommodation published on GTour and open a property to see room types and nightly pricing.',
};

export default async function HotelsPage() {
  const result = await fetchHotels();
  const hotels = result.ok ? result.data : [];

  return (
    <div className="gtour-section">
      <div className="gtour-container">
        <SectionHeading
          eyebrow="Where to stay"
          title="Stays we have published for you"
          description="Every property is linked to a destination. Open a stay to see room types and nightly pricing — availability is always confirmed on the server at booking time."
          action={{ href: '/destinations', label: 'Browse destinations' }}
        />

        <div className="mt-12">
          {!result.ok ? (
            <ErrorState title="Stays are unavailable" description={result.message} />
          ) : hotels.length === 0 ? (
            <EmptyState
              title="No stays published yet"
              description="Our team has not published accommodation yet. In the meantime, explore the destinations we cover."
              action={
                <ButtonLink href="/destinations" variant="outline">
                  Explore destinations
                </ButtonLink>
              }
            />
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hotels.map((hotel, index) => (
                <li key={hotel._id}>
                  <Reveal delayMs={Math.min(index, 5) * 70}>
                    <HotelCard hotel={hotel} className="h-full" />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}