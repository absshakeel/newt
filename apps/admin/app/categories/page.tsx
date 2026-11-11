'use client';

import { useEffect, useMemo, useState } from 'react';
import AuthGuard from '@gtour/ui';
import AdminShell from '@/components/admin/AdminShell';
import { Button } from '@gtour/ui';
import { Field, Input } from '@gtour/ui';
import { apiClient, getApiErrorMessage } from '@gtour/utils';

type Category = { _id: string; name: string; description?: string; icon?: string };

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [query, setQuery] = useState('');

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get('/categories');
      setItems(data.categories ?? []);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((c) => [c.name, c.description, c.icon].some((v) => (v || '').toLowerCase().includes(q)));
  }, [items, query]);

  function resetForm() {
    setEditingId(null);
    setName('');
    setDescription('');
    setIcon('');
  }

  function startEdit(c: Category) {
    setEditingId(c._id);
    setName(c.name || '');
    setDescription(c.description || '');
    setIcon(c.icon || '');
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return alert('Name must be at least 2 characters.');
    setSaving(true);
    try {
      const payload = { name: name.trim(), description: description.trim() || undefined, icon: icon.trim() || undefined };
      if (editingId) {
        await apiClient.put(`/categories/${editingId}`, payload);
      } else {
        await apiClient.post('/categories', payload);
      }
      resetForm();
      await load();
    } catch (e) {
      alert(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this category? Destinations using it may be affected.')) return;
    try {
      await apiClient.delete(`/categories/${id}`);
      if (editingId === id) resetForm();
      await load();
    } catch (e) {
      alert(getApiErrorMessage(e));
    }
  }

  return (
    <AuthGuard requireAdmin>
      <AdminShell title="Categories" subtitle="Create and manage destination categories.">
      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <section className="rounded-2xl border border-sand-200/90 bg-white p-5 shadow-[0_10px_30px_-20px_rgba(12,28,44,0.3)]">
          <h2 className="font-display text-lg font-semibold text-ink-900">{editingId ? 'Edit category' : 'Add category'}</h2>
          <p className="mt-1 text-sm text-ink-500">Categories are used when creating destinations.</p>
          <form onSubmit={submit} className="mt-4 space-y-3">
            <Field label="Name" htmlFor="cat-name"><Input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} className="bg-white" /></Field>
            <Field label="Description" htmlFor="cat-desc"><Input id="cat-desc" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-white" /></Field>
            <Field label="Icon (optional)" htmlFor="cat-icon"><Input id="cat-icon" value={icon} onChange={(e) => setIcon(e.target.value)} className="bg-white" placeholder="e.g. beach" /></Field>
            <div className="flex gap-2 pt-1">
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : (editingId ? 'Update' : 'Create')}</Button>
              {editingId ? <button type="button" onClick={resetForm} className="rounded-pill border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700">Cancel</button> : null}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-sand-200/90 bg-white p-5 shadow-[0_10px_30px_-20px_rgba(12,28,44,0.3)]">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-500">{loading ? 'Loading…' : `${filtered.length} of ${items.length} categories`}</p>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter categories…" className="w-full rounded-xl border border-sand-300 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-sea-500 sm:max-w-xs" />
          </div>
          {error ? <div className="rounded-xl border border-terracotta-200 bg-terracotta-50 px-4 py-3 text-sm text-terracotta-700">{error}</div> : null}
          {!loading && !error ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-sand-200 text-xs uppercase tracking-[0.12em] text-ink-400">
                    <th className="px-3 py-3 font-semibold">Name</th>
                    <th className="px-3 py-3 font-semibold">Description</th>
                    <th className="px-3 py-3 font-semibold">Icon</th>
                    <th className="px-3 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c._id} className="border-b border-sand-100 last:border-0">
                      <td className="px-3 py-3 font-medium text-ink-900">{c.name}</td>
                      <td className="px-3 py-3 text-ink-600">{c.description || '—'}</td>
                      <td className="px-3 py-3 text-ink-600">{c.icon || '—'}</td>
                      <td className="px-3 py-3">
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => startEdit(c)} className="rounded-lg border border-sea-200 bg-sea-50 px-3 py-1.5 text-xs font-semibold text-sea-700 hover:bg-sea-100">Edit</button>
                          <button type="button" onClick={() => remove(c._id)} className="rounded-lg border border-terracotta-200 bg-white px-3 py-1.5 text-xs font-semibold text-terracotta-700 hover:bg-terracotta-50">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 ? <tr><td colSpan={4} className="px-3 py-8 text-center text-sm text-ink-500">No categories found.</td></tr> : null}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </div>
      </AdminShell>
    </AuthGuard>
  );
}
