import type { Metadata } from 'next';
import { SectionHeading } from '@/components/home/Section';
import { ButtonLink } from '@gtour/ui';
import { EmptyState, ErrorState } from '@gtour/ui';
import { Reveal } from '@gtour/ui';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { fetchVehicles } from '@/lib/server-api';

export const revalidate = 120;

export const metadata: Metadata = {
  title: 'Vehicles & transfers',
  description:
    'Compare vehicles published on GTour by type, capacity and daily price, and see which provider offers them.',
};

export default async function VehiclesPage() {
  const result = await fetchVehicles();
  const vehicles = result.ok ? result.data : [];

  return (
    <div className="gtour-section">
      <div className="gtour-container">
        <SectionHeading
          eyebrow="Getting around"
          title="Vehicles for the road between stops"
          description="Vehicles are listed with their provider, seating capacity and daily price so you can compare before you decide. Availability is confirmed on the server at booking time."
          action={{ href: '/destinations', label: 'Browse destinations' }}
        />

        <div className="mt-12">
          {!result.ok ? (
            <ErrorState title="Vehicles are unavailable" description={result.message} />
          ) : vehicles.length === 0 ? (
            <EmptyState
              title="No vehicles published yet"
              description="Our providers have not published vehicles yet. Explore destinations in the meantime."
              action={
                <ButtonLink href="/destinations" variant="outline">
                  Explore destinations
                </ButtonLink>
              }
            />
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle, index) => (
                <li key={vehicle._id}>
                  <Reveal delayMs={Math.min(index, 5) * 70}>
                    <VehicleCard vehicle={vehicle} className="h-full" />
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