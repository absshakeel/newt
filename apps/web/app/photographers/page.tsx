import type { Metadata } from 'next';
import { SectionHeading } from '@/components/home/Section';
import { PhotographerCard } from '@/components/photographers/PhotographerCard';
import { ButtonLink } from '@gtour/ui';
import { EmptyState, ErrorState } from '@gtour/ui';
import { Reveal } from '@gtour/ui';
import { fetchPhotographers } from '@/lib/server-api';

export const revalidate = 120;

export const metadata: Metadata = {
  title: 'Photographers',
  description:
    'Find travel photographers published on GTour and see the destinations and services they cover.',
};

export default async function PhotographersPage() {
  const result = await fetchPhotographers();
  const photographers = result.ok ? result.data : [];

  return (
    <div className="gtour-section">
      <div className="gtour-container">
        <SectionHeading
          eyebrow="Photography"
          title="Photographers who travel with you"
          description="Browse the photographers our partners publish on GTour. Service packages, pricing and availability are recorded against each photographer on the server."
          action={{ href: '/destinations', label: 'Browse destinations' }}
        />

        <div className="mt-12">
          {!result.ok ? (
            <ErrorState title="Photographers are unavailable" description={result.message} />
          ) : photographers.length === 0 ? (
            <EmptyState
              title="No photographers published yet"
              description="Our partners have not published photography services yet. Explore destinations in the meantime."
              action={
                <ButtonLink href="/destinations" variant="outline">
                  Explore destinations
                </ButtonLink>
              }
            />
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {photographers.map((photographer, index) => (
                <li key={photographer._id}>
                  <Reveal delayMs={Math.min(index, 5) * 70}>
                    <PhotographerCard photographer={photographer} className="h-full" />
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