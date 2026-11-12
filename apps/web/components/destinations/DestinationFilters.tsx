'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@gtour/ui';
import { Field, Input, Select } from '@gtour/ui';
import type { PopulatedCategory, PopulatedLocation } from '@gtour/utils';

const SORT_OPTIONS = [
  { value: 'rating:desc', label: 'Highest rated' },
  { value: 'views:desc', label: 'Most viewed' },
  { value: 'name:asc', label: 'Name (A–Z)' },
  { value: 'created_at:desc', label: 'Newest first' },
] as const;

export interface DestinationFilterValues {
  search: string;
  categoryId: string;
  locationId: string;
  sort: string;
}

/**
 * Filter bar for the destination index. It only builds a URL — all filtering
 * and pagination happens on the server against `GET /destinations/search`.
 */
export default function DestinationFilters({
  categories,
  locations,
  values,
  resultCount,
}: {
  categories: PopulatedCategory[];
  locations: PopulatedLocation[];
  values: DestinationFilterValues;
  resultCount: number;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(values.search);
  const [categoryId, setCategoryId] = useState(values.categoryId);
  const [locationId, setLocationId] = useState(values.locationId);
  const [sort, setSort] = useState(values.sort);

  // Keep form controls in sync when URL/search params change (navigation, clear, back/forward).
  useEffect(() => {
    setSearch(values.search);
    setCategoryId(values.categoryId);
    setLocationId(values.locationId);
    setSort(values.sort);
  }, [values.search, values.categoryId, values.locationId, values.sort]);

  function buildUrl(overrides: Partial<DestinationFilterValues> = {}) {
    const next = { search, categoryId, locationId, sort, ...overrides };
    const [sortBy, sortOrder] = next.sort.split(':');
    const params = new URLSearchParams();

    if (next.search.trim()) params.set('search', next.search.trim());
    if (next.categoryId) params.set('category_id', next.categoryId);
    if (next.locationId) params.set('location_id', next.locationId);
    if (sortBy) params.set('sort_by', sortBy);
    if (sortOrder) params.set('sort_order', sortOrder);

    const query = params.toString();
    return `/destinations${query ? `?${query}` : ''}`;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Any new filter set resets pagination to the first page.
    router.push(buildUrl());
  }

  function handleClear() {
    setSearch('');
    setCategoryId('');
    setLocationId('');
    setSort('rating:desc');
    router.push('/destinations');
  }

  const hasFilters = Boolean(search.trim() || categoryId || locationId);

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-panel border border-ink-100 bg-white/85 p-5 shadow-soft backdrop-blur-sm sm:p-6"
    >
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Field label="Where to?" htmlFor="destination-search">
            <Input
              id="destination-search"
              name="search"
              type="search"
              placeholder="Search destinations, regions, ideas"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </Field>
        </div>

        <div className="lg:col-span-3">
          <Field label="Travel style" htmlFor="destination-category">
            <Select
              id="destination-category"
              name="category_id"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
            >
              <option value="">All styles</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="lg:col-span-3">
          <Field label="Region" htmlFor="destination-location">
            <Select
              id="destination-location"
              name="location_id"
              value={locationId}
              onChange={(event) => setLocationId(event.target.value)}
            >
              <option value="">All regions</option>
              {locations.map((location) => (
                <option key={location._id} value={location._id}>
                  {[location.name, location.country].filter(Boolean).join(', ')}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="lg:col-span-2">
          <Field label="Sort by" htmlFor="destination-sort">
            <Select
              id="destination-sort"
              name="sort"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="submit" size="md">
          Show destinations
        </Button>
        {hasFilters ? (
          <Button type="button" variant="ghost" size="md" onClick={handleClear}>
            Clear filters
          </Button>
        ) : null}
        <p role="status" aria-live="polite" className="text-sm text-ink-500">
          {resultCount === 1 ? '1 destination' : `${resultCount} destinations`}
        </p>
      </div>
    </form>
  );
}