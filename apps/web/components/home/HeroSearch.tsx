'use client';

import { useRouter } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { Button } from '@gtour/ui';
import { cn } from '@gtour/utils';
import type { PopulatedCategory, PopulatedLocation } from '@gtour/utils';

/**
 * Destination discovery search. Routes to `/destinations` using real
 * category/location filters (from API) plus free-text search.
 */
export default function HeroSearch({
  categories = [],
  locations = [],
}: {
  categories?: PopulatedCategory[];
  locations?: PopulatedLocation[];
}) {
  const router = useRouter();
  const fieldId = useId();
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [locationId, setLocationId] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (categoryId) params.set('category_id', categoryId);
    if (locationId) params.set('location_id', locationId);
    const query = params.toString();
    router.push(`/destinations${query ? `?${query}` : ''}`);
  }

  const label = 'block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink-500';
  const control =
    'mt-1.5 w-full border-0 bg-transparent p-0 text-sm font-medium text-ink-900 placeholder:font-normal placeholder:text-ink-400 focus:outline-none focus:ring-0';

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Search destinations"
      className="w-full rounded-panel border border-white/80 bg-white/96 p-3 shadow-panel ring-1 ring-ink-900/5 backdrop-blur-md sm:p-4"
    >
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_auto] sm:items-end">
        <div className="rounded-2xl border border-transparent px-3 py-2.5 transition-all duration-200 focus-within:border-sea-200 focus-within:bg-sea-50/40 hover:bg-sand-100/60 sm:col-span-2 lg:col-span-1">
          <label htmlFor={`${fieldId}-search`} className={label}>
            Where to?
          </label>
          <input
            id={`${fieldId}-search`}
            name="search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search destinations, regions, ideas"
            autoComplete="off"
            className={control}
          />
        </div>

        <div className="rounded-2xl border border-transparent px-3 py-2.5 transition-all duration-200 focus-within:border-sea-200 focus-within:bg-sea-50/40 hover:bg-sand-100/60">
          <label htmlFor={`${fieldId}-category`} className={label}>
            Travel style
          </label>
          <select
            id={`${fieldId}-category`}
            name="category_id"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className={cn(control, 'cursor-pointer')}
          >
            <option value="">All styles</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-transparent px-3 py-2.5 transition-all duration-200 focus-within:border-sea-200 focus-within:bg-sea-50/40 hover:bg-sand-100/60">
          <label htmlFor={`${fieldId}-location`} className={label}>
            Region
          </label>
          <select
            id={`${fieldId}-location`}
            name="location_id"
            value={locationId}
            onChange={(event) => setLocationId(event.target.value)}
            className={cn(control, 'cursor-pointer')}
          >
            <option value="">All regions</option>
            {locations.map((location) => (
              <option key={location._id} value={location._id}>
                {[location.name, location.country].filter(Boolean).join(', ')}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" size="lg" className="h-[52px] w-full justify-center sm:col-span-2 lg:col-span-1 lg:min-w-[132px]">
          Search
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M16.5 16.5 21 21" />
          </svg>
        </Button>
      </div>
    </form>
  );
}