'use client';

import { useRouter } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { Button } from '@gtour/ui';
import { cn } from '@gtour/utils';

const INTERESTS = [
  { value: '', label: 'Any travel style' },
  { value: 'nature', label: 'Nature & mountains' },
  { value: 'beach', label: 'Beaches' },
  { value: 'historical', label: 'Historical places' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'culture', label: 'Cultural experiences' },
  { value: 'city', label: 'City exploration' },
] as const;

/**
 * Destination discovery search (Phase 16). No check-in/check-out/guests.
 * Routes to real `/destinations` results using the existing search API/filters.
 */
export default function HeroSearch() {
  const router = useRouter();
  const fieldId = useId();
  const [destination, setDestination] = useState('');
  const [interest, setInterest] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (destination.trim()) params.set('search', destination.trim());
    if (interest) params.set('search', [destination.trim(), interest].filter(Boolean).join(' ').trim());
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
      <div className="grid gap-2 sm:grid-cols-[1.4fr_1fr_auto] sm:items-end">
        <div className="rounded-2xl border border-transparent px-3 py-2.5 transition-all duration-200 focus-within:border-sea-200 focus-within:bg-sea-50/40 hover:bg-sand-100/60">
          <label htmlFor={`${fieldId}-destination`} className={label}>
            Destination
          </label>
          <input
            id={`${fieldId}-destination`}
            name="destination"
            type="text"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder="Where would you love to go?"
            autoComplete="off"
            className={control}
          />
        </div>

        <div className="rounded-2xl border border-transparent px-3 py-2.5 transition-all duration-200 focus-within:border-sea-200 focus-within:bg-sea-50/40 hover:bg-sand-100/60">
          <label htmlFor={`${fieldId}-interest`} className={label}>
            Travel style
          </label>
          <select
            id={`${fieldId}-interest`}
            name="interest"
            value={interest}
            onChange={(event) => setInterest(event.target.value)}
            className={cn(control, 'cursor-pointer')}
          >
            {INTERESTS.map((option) => (
              <option key={option.value || 'any'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" size="lg" className="h-[52px] w-full justify-center sm:min-w-[132px]">
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