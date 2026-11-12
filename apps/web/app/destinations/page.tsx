import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DestinationCard } from '@/components/destinations/DestinationCard';
import DestinationFilters from '@/components/destinations/DestinationFilters';
import Pagination from '@/components/destinations/Pagination';
import { ButtonLink } from '@gtour/ui';
import { CardSkeletonGrid, EmptyState, ErrorState } from '@gtour/ui';
import { Reveal } from '@gtour/ui';
import { fetchDestinationFilters, fetchDestinationPage } from '@/lib/server-api';

export const metadata: Metadata = {
  title: 'Destinations',
  description:
    'Browse every destination on GTour and filter by travel style, region and rating to plan your next journey.',
};

const PAGE_SIZE = 9;

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

function buildQueryHref(params: SearchParams, overrides: Record<string, string | undefined>) {
  const merged = new URLSearchParams();
  const source = { ...params, ...overrides };

  Object.entries(source).forEach(([key, value]) => {
    const text = firstValue(value);
    if (text) merged.set(key, text);
  });

  const query = merged.toString();
  return `/destinations${query ? `?${query}` : ''}`;
}

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const search = firstValue(params.search);
  const categoryId = firstValue(params.category_id);
  const locationId = firstValue(params.location_id);
  const sortBy = firstValue(params.sort_by) || 'rating';
  const sortOrder = firstValue(params.sort_order) === 'asc' ? 'asc' : 'desc';
  const parsedPage = Number.parseInt(firstValue(params.page) || '1', 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const [result, filtersResult] = await Promise.all([
    fetchDestinationPage({
      search: search || undefined,
      category_id: categoryId || undefined,
      location_id: locationId || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
      page,
      limit: PAGE_SIZE,
    }),
    fetchDestinationFilters(),
  ]);

  const destinations = result.ok ? result.data.destinations : [];
  const total = result.ok ? result.data.total : 0;
  const pages = result.ok ? result.data.pages : 1;
  const categories = filtersResult.ok ? filtersResult.data.categories : [];
  const locations = filtersResult.ok ? filtersResult.data.locations : [];

  return (
    <div className="gtour-section">
      <div className="gtour-container">
        <header className="max-w-3xl">
          <p className="gtour-eyebrow">Discover</p>
          <h1 className="mt-3 text-balance font-display text-display font-semibold text-ink-900">
            Destinations worth planning around
          </h1>
          <p className="mt-5 text-pretty text-base leading-relaxed text-ink-500 sm:text-lg">
            Filter by travel style, region and popularity. Every destination below is published by
            our team and links to its own editorial page.
          </p>
        </header>

        <div className="mt-10">
          <DestinationFilters
            categories={categories}
            locations={locations}
            values={{ search, categoryId, locationId, sort: `${sortBy}:${sortOrder}` }}
            resultCount={total}
          />
        </div>

        <div className="mt-10">
          {!result.ok ? (
            <ErrorState title="Destinations are unavailable" description={result.message} />
          ) : destinations.length === 0 ? (
            (() => {
              const hasActiveFilters = Boolean(search || categoryId || locationId);
              return (
                <EmptyState
                  title={hasActiveFilters ? 'No destinations match those filters' : 'No destinations published yet'}
                  description={
                    hasActiveFilters
                      ? 'Try a different travel style or region, or clear the filters to see everything we have published.'
                      : 'Once destinations are added and linked to categories and locations, they will appear here for travellers to explore.'
                  }
                  action={
                    hasActiveFilters ? (
                      <ButtonLink href="/destinations" variant="outline">
                        Clear filters
                      </ButtonLink>
                    ) : undefined
                  }
                />
              );
            })()
          ) : (
            <Suspense fallback={<CardSkeletonGrid count={PAGE_SIZE} />}>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {destinations.map((destination, index) => (
                  <li key={destination._id}>
                    <Reveal delayMs={Math.min(index, 5) * 70}>
                      <DestinationCard
                        destination={destination}
                        priority={index < 3}
                        imageClassName="aspect-[4/5]"
                      />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </Suspense>
          )}
        </div>

        <Pagination
          className="mt-12"
          page={page}
          pages={pages}
          buildHref={(nextPage) =>
            buildQueryHref(params, { page: nextPage === 1 ? undefined : String(nextPage) })
          }
        />
      </div>
    </div>
  );
}