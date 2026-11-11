'use client';

import { useEffect, useMemo, useState } from 'react';
import AuthGuard from '@gtour/ui';
import AdminShell from '@/components/admin/AdminShell';
import { apiClient, getApiErrorMessage } from '@gtour/utils';
import { readUser } from '@gtour/utils';
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

type Profile = {
  bio?: string;
  preferred_language?: string;
  travel_preferences?: string[];
  profile_image?: string;
  date_of_birth?: string;
  address?: string;
};

type UserRow = {
  _id: string;
  email: string;
  name: string;
  role: string;
  account_status: string;
  created_at?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [viewing, setViewing] = useState<{ user: UserRow; profile: Profile | null } | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const current = readUser();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get<{ success: boolean; users: UserRow[] }>('/users');
      setUsers(data.users ?? []);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredUsers = useMemo(() => {
    if (statusFilter === 'all') return users;
    return users.filter((u) => u.account_status === statusFilter);
  }, [users, statusFilter]);

  async function setStatus(id: string, account_status: 'active' | 'suspended') {
    setBusyId(id);
    try {
      const { data } = await apiClient.patch(`/users/${id}/status`, { account_status });
      const updated = data.user as UserRow | undefined;
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, ...(updated || {}), account_status } : u)));
      if (viewing?.user._id === id) setViewing((v) => (v ? { ...v, user: { ...v.user, ...(updated || {}), account_status } } : v));
    } catch (e) {
      alert(getApiErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  }

  async function removeUser(id: string) {
    if (!confirm('Delete this user account? This cannot be undone.')) return;
    setBusyId(id);
    try {
      await apiClient.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      if (viewing?.user._id === id) setViewing(null);
    } catch (e) {
      alert(getApiErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  }

  async function viewProfile(u: UserRow) {
    setViewLoading(true);
    try {
      const { data } = await apiClient.get(`/users/${u._id}`);
      setViewing({ user: (data.data?.user ?? u) as UserRow, profile: (data.data?.profile ?? null) as Profile | null });
    } catch (e) {
      alert(getApiErrorMessage(e));
    } finally {
      setViewLoading(false);
    }
  }

  const columns = useMemo<ColumnDef<UserRow>[]>(() => [
    {
      accessorKey: 'name',
      header: 'User',
      cell: ({ row }) => (
        <div className="min-w-[180px]">
          <p className="font-medium text-ink-900">{row.original.name}</p>
          <p className="text-xs text-ink-500">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ getValue }) => <span className="rounded-full bg-sand-100 px-2.5 py-1 text-xs font-semibold capitalize text-ink-700">{String(getValue() || '').replace('_', ' ')}</span>,
    },
    {
      accessorKey: 'account_status',
      header: 'Status',
      cell: ({ getValue }) => {
        const v = String(getValue() || '');
        const cls = v === 'active' ? 'bg-sea-50 text-sea-700' : v === 'suspended' ? 'bg-terracotta-50 text-terracotta-700' : 'bg-gold-100/70 text-ink-700';
        return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${cls}`}>{v.replace('_', ' ')}</span>;
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const u = row.original;
        const isSelf = current?.id === u._id;
        const isBusy = busyId === u._id;
        return (
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => viewProfile(u)} className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-sand-50">View</button>
            {u.account_status === 'active' ? (
              <button type="button" disabled={isBusy || isSelf} onClick={() => setStatus(u._id, 'suspended')} className="rounded-lg border border-gold-300 bg-gold-100/40 px-3 py-1.5 text-xs font-semibold text-ink-800 hover:bg-gold-100/70 disabled:opacity-50" title={isSelf ? 'You cannot suspend your own account' : ''}>
                {isBusy ? '...' : 'Suspend'}
              </button>
            ) : (
              <button type="button" disabled={isBusy} onClick={() => setStatus(u._id, 'active')} className="rounded-lg border border-sea-200 bg-sea-50 px-3 py-1.5 text-xs font-semibold text-sea-700 hover:bg-sea-100 disabled:opacity-50">
                {isBusy ? '...' : 'Activate'}
              </button>
            )}
            <button type="button" disabled={isBusy || isSelf} onClick={() => removeUser(u._id)} className="rounded-lg border border-terracotta-200 bg-white px-3 py-1.5 text-xs font-semibold text-terracotta-700 hover:bg-terracotta-50 disabled:opacity-50" title={isSelf ? 'You cannot delete your own account here' : ''}>
              Delete
            </button>
          </div>
        );
      },
    },
  ], [busyId, current?.id]);

  const table = useReactTable({
    data: filteredUsers,
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
      <AdminShell title="Users" subtitle="View and manage registered accounts, profiles, and access.">
      <div className="rounded-2xl border border-sand-200/90 bg-white p-4 shadow-[0_10px_30px_-20px_rgba(12,28,44,0.3)] sm:p-5">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <input
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search by name, email, role, status…"
              className="w-full rounded-xl border border-sand-300 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-sea-500 sm:max-w-sm"
            />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-sand-300 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-sea-500">
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending_verification">Pending verification</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-ink-500">{loading ? 'Loading…' : `${table.getFilteredRowModel().rows.length} user(s)`}</p>
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
                            <button
                              type="button"
                              className={header.column.getCanSort() ? 'inline-flex items-center gap-1 hover:text-ink-700' : ''}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {{ asc: ' ↑', desc: ' ↓' }[header.column.getIsSorted() as string] ?? null}
                            </button>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-b border-sand-100 align-top last:border-0 hover:bg-sand-50/50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-3 py-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  ))}
                  {table.getRowModel().rows.length === 0 ? (
                    <tr><td colSpan={columns.length} className="px-3 py-10 text-center text-sm text-ink-500">No users found.</td></tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-sand-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-ink-500">
                <span>Rows per page</span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                  className="rounded-lg border border-sand-300 bg-white px-2 py-1.5 text-sm"
                >
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

      {(viewing || viewLoading) ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/45 p-4" onClick={() => !viewLoading && setViewing(null)}>
          <div className="max-h-[85vh] w-full max-w-2xl overflow-auto rounded-2xl border border-sand-200 bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {viewLoading || !viewing ? (
              <div className="flex items-center gap-3 text-sm text-ink-500"><span className="h-5 w-5 animate-spin rounded-full border-2 border-sand-300 border-t-sea-500" />Loading profile…</div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-xl border border-sand-200 bg-sand-50">
                      {viewing.profile?.profile_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={viewing.profile.profile_image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-ink-400">{(viewing.user.name?.[0] || 'U').toUpperCase()}</div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-ink-900">{viewing.user.name}</h3>
                      <p className="text-sm text-ink-500">{viewing.user.email}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setViewing(null)} className="rounded-lg border border-ink-200 px-3 py-1.5 text-sm font-semibold text-ink-600 hover:bg-sand-50">Close</button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-sand-100 px-2.5 py-1 text-xs font-semibold capitalize text-ink-700">{viewing.user.role.replace('_', ' ')}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${viewing.user.account_status === 'active' ? 'bg-sea-50 text-sea-700' : viewing.user.account_status === 'suspended' ? 'bg-terracotta-50 text-terracotta-700' : 'bg-gold-100/70 text-ink-700'}`}>{viewing.user.account_status.replace('_', ' ')}</span>
                </div>

                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <div><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-400">Phone</dt><dd className="mt-1 text-ink-700">{(viewing.user as any).phone || '—'}</dd></div>
                  <div><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-400">Preferred language</dt><dd className="mt-1 text-ink-700">{viewing.profile?.preferred_language || '—'}</dd></div>
                  <div><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-400">Date of birth</dt><dd className="mt-1 text-ink-700">{viewing.profile?.date_of_birth ? String(viewing.profile.date_of_birth).slice(0, 10) : '—'}</dd></div>
                  <div><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-400">Address</dt><dd className="mt-1 text-ink-700">{viewing.profile?.address || '—'}</dd></div>
                  <div className="sm:col-span-2"><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-400">Bio</dt><dd className="mt-1 text-ink-700">{viewing.profile?.bio || '—'}</dd></div>
                  <div className="sm:col-span-2"><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-400">Travel preferences</dt><dd className="mt-1 text-ink-700">{Array.isArray(viewing.profile?.travel_preferences) && viewing.profile!.travel_preferences!.length ? viewing.profile!.travel_preferences!.join(', ') : '—'}</dd></div>
                </dl>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-sand-200 pt-4">
                  {viewing.user.account_status === 'active' ? (
                    <button type="button" disabled={current?.id === viewing.user._id || busyId === viewing.user._id} onClick={() => setStatus(viewing.user._id, 'suspended')} className="rounded-xl border border-gold-300 bg-gold-100/40 px-4 py-2 text-sm font-semibold text-ink-800 hover:bg-gold-100/70 disabled:opacity-50">
                      Temporarily suspend
                    </button>
                  ) : (
                    <button type="button" disabled={busyId === viewing.user._id} onClick={() => setStatus(viewing.user._id, 'active')} className="rounded-xl bg-sea-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sea-700 disabled:opacity-50">
                      Activate account
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
      </AdminShell>
    </AuthGuard>
  );
}
