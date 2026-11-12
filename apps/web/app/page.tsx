import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import PopularDestinations from '@/components/home/PopularDestinations';
import CompleteJourney from '@/components/home/CompleteJourney';
import BecomeProvider from '@/components/home/BecomeProvider';
import { fetchDestinationFilters, fetchDestinationPage } from '@/lib/server-api';

// Revalidate the marketing surface periodically so newly published
// destinations appear without a redeploy.
export const revalidate = 120;

export const metadata: Metadata = {
  title: 'GTour — Your next journey starts here',
  description:
    'Discover extraordinary places and everything you need to experience them.',
};

export default async function HomePage() {
  const [destinationResult, filtersResult] = await Promise.all([
    fetchDestinationPage({ limit: 6, sort_by: 'rating', sort_order: 'desc' }),
    fetchDestinationFilters(),
  ]);
  const destinations = destinationResult.ok ? destinationResult.data.destinations : [];
  const categories = filtersResult.ok ? filtersResult.data.categories : [];
  const locations = filtersResult.ok ? filtersResult.data.locations : [];

  return (
    <>
      <Hero categories={categories} locations={locations} />
      <PopularDestinations
        destinations={destinations}
        error={destinationResult.ok ? undefined : destinationResult.message}
      />
      <CompleteJourney />
      <BecomeProvider />
    </>
  );
}