'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AuthGuard from '@gtour/ui';
import AdminShell from '@/components/admin/AdminShell';
import { apiClient, getApiErrorMessage } from '@gtour/utils';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

type Destination = {
  _id: string;
  name: string;
  description?: string;
  average_rating?: number;
  views?: number;
  estimated_budget?: number;
  archived_at?: string | null;
  category_id?: { name?: string } | string;
  location_id?: { name?: string; country?: string } | string;
};

function textOf(v: Destination['category_id'] | Destination['location_id']): string {
  if (!v) return '';
  if (typeof v === 'string') return v;
  return [v.name, (v as any).country].filter(Boolean).join(', ');
}

export default function AdminDestinationsPage() {
  const [items, setItems] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get<{ success: boolean; destinations: Destination[] }>('/destinations', {
        params: { limit: 100, sort_by: 'created_at', sort_order: 'desc' },
      });
      setItems(data.destinations ?? []);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function archive(id: string) {
    if (!confirm('Archive this destination? It will be hidden from public listings.')) return;
    setBusyId(id);
    try {
      await apiClient.delete(`/destinations/${id}`);
      setItems((prev) => prev.filter((d) => d._id !== id));
    } catch (e) {
      alert(getApiErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  }

  const columns = useMemo<ColumnDef<Destination>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Destination',
      cell: ({ row }) => (
        <div className="min-w-[200px]">
          <p className="font-medium text-ink-900">{row.original.name}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-ink-500">{row.original.description || 'â€”'}</p>
        </div>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      accessorFn: (row) => (typeof row.category_id === 'object' ? row.category_id?.name || '' : ''),
      cell: ({ row }) => <span className="text-ink-700">{typeof row.original.category_id === 'object' ? row.original.category_id?.name || 'â€”' : 'â€”'}</span>,
    },
    {
      id: 'location',
      header: 'Location',
      accessorFn: (row) => textOf(row.location_id),
      cell: ({ row }) => {
        const loc = row.original.location_id;
        const text = typeof loc === 'object' ? [loc?.name, (loc as any)?.country].filter(Boolean).join(', ') : 'â€”';
        return <span className="text-ink-700">{text || 'â€”'}</span>;
      },
    },
    {
      accessorKey: 'average_rating',
      header: 'Rating',
      cell: ({ getValue }) => <span className="text-ink-700">{getValue() != null ? Number(getValue()).toFixed(1) : 'â€”'}</span>,
    },
    {
      accessorKey: 'views',
      header: 'Views',
      cell: ({ getValue }) => <span className="text-ink-700">{Number(getValue() ?? 0)}</span>,
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const d = row.original;
        return (
          <div className="flex justify-end gap-2">
            <a href={`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/destinations/${d._id}`} target="_blank" rel="noreferrer" className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-sea-300 hover:bg-sand-50">View</a>
            <Link href={`/destinations/${d._id}/edit`} className="rounded-lg border border-sea-200 bg-sea-50 px-3 py-1.5 text-xs font-semibold text-sea-700 transition hover:bg-sea-100">Edit</Link>
            <button type="button" onClick={() => archive(d._id)} disabled={busyId === d._id} className="rounded-lg border border-terracotta-200 bg-white px-3 py-1.5 text-xs font-semibold text-terracotta-700 transition hover:bg-terracotta-50 disabled:opacity-50">
              {busyId === d._id ? '...' : 'Archive'}
            </button>
          </div>
        );
      },
    },
  ], [busyId]);

  const table = useReactTable({
    data: items,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <AuthGuard requireAdmin>
      <AdminShell title="Destinations" subtitle="Create, edit, and manage destination listings.">
      <div className="rounded-2xl border border-sand-200/90 bg-white p-4 shadow-[0_10px_30px_-20px_rgba(12,28,44,0.3)] sm:p-5">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search destinations, categories, locationsâ€¦"
              className="w-full rounded-xl border border-sand-300 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-sea-500 sm:max-w-md"
            />
            <p className="text-sm text-ink-500">{loading ? 'Loadingâ€¦' : `${table.getFilteredRowModel().rows.length} destination(s)`}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/destinations/new" className="rounded-xl bg-sea-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sea-700">+ Add destination</Link>
            <Link href="/categories" className="rounded-xl border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-sea-300 hover:bg-sand-50">Categories</Link>
            <Link href="/locations" className="rounded-xl border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-sea-300 hover:bg-sand-50">Locations</Link>
            <button type="button" onClick={load} className="rounded-xl border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-sea-300 hover:bg-sand-50">Refresh</button>
          </div>
        </div>

        {error ? <div className="rounded-xl border border-terracotta-200 bg-terracotta-50 px-4 py-3 text-sm text-terracotta-700">{error}</div> : null}

        {!loading && !error ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id} className="border-b border-sand-200 text-xs uppercase tracking-[0.12em] text-ink-400">
                      {hg.headers.map((header) => (
                        <th key={header.id} className="px-3 py-3 font-semibold">
                          {header.isPlaceholder ? null : (
                            <button type="button" className={header.column.getCanSort() ? 'inline-flex items-center gap-1 hover:text-ink-700' : ''} onClick={header.column.getToggleSortingHandler()}>
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {{ asc: ' â†‘', desc: ' â†“' }[header.column.getIsSorted() as string] ?? null}
                            </button>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-b border-sand-100 last:border-0 hover:bg-sand-50/50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-3 py-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  ))}
                  {table.getRowModel().rows.length === 0 ? (
                    <tr><td colSpan={columns.length} className="px-3 py-10 text-center text-sm text-ink-500">No destinations found.</td></tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-sand-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-ink-500">
                <span>Rows per page</span>
                <select value={table.getState().pagination.pageSize} onChange={(e) => table.setPageSize(Number(e.target.value))} className="rounded-lg border border-sand-300 bg-white px-2 py-1.5 text-sm">
                  {[10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-ink-500">Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}</span>
                <button type="button" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-sm font-semibold text-ink-700 disabled:opacity-40">Previous</button>
                <button type="button" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-sm font-semibold text-ink-700 disabled:opacity-40">Next</button>
              </div>
            </div>
          </>
        ) : null}
      </div>

      <p className="mt-3 text-xs text-ink-400">Create and edit require valid category and location references. Archive removes the destination from public listings.</p>
      </AdminShell>
    </AuthGuard>
  );
}

