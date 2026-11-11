/** Shared display formatting. All monetary values come from the API in USD. */

export function formatCurrency(value?: number | null): string | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value?: number | null): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '0';
  return new Intl.NumberFormat('en-US').format(value);
}

/** Whole nights between two `yyyy-mm-dd` values, or `undefined` when invalid. */
export function nightsBetween(startDate: string, endDate: string): number | undefined {
  if (!startDate || !endDate) return undefined;

  const start = new Date(`${startDate}T00:00:00Z`).getTime();
  const end = new Date(`${endDate}T00:00:00Z`).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return undefined;

  return Math.round((end - start) / 86_400_000);
}

/** `yyyy-mm-dd` for a `Date`, used as the minimum value of date inputs. */
export function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Local calendar date → the ISO datetime the API expects. */
export function dateInputToIso(value: string): string {
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}