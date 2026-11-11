'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { Button } from '@gtour/ui';
import { Field, Input } from '@gtour/ui';
import { apiClient, getApiErrorMessage } from '@gtour/utils';

type Option = { _id: string; name: string; country?: string; region?: string; icon?: string };

type Destination = {
  _id: string;
  name: string;
  description: string;
  images: string[];
  estimated_budget?: number;
  best_visit_season?: string;
  category_id: any;
  location_id: any;
};

function toId(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value._id || '';
}

export default function DestinationForm({ mode, id }: { mode: 'create' | 'edit'; id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [categories, setCategories] = useState<Option[]>([]);
  const [locations, setLocations] = useState<Option[]>([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [bestVisitSeason, setBestVisitSeason] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const title = mode === 'create' ? 'Create destination' : 'Edit destination';
  const subtitle = mode === 'create'
    ? 'Add a new destination (admin). Requires valid category and location.'
    : 'Update destination details (admin).';

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [filtersRes, destRes] = await Promise.all([
          apiClient.get('/destinations/filters'),
          mode === 'edit' && id ? apiClient.get(`/destinations/${id}`) : Promise.resolve(null),
        ]);
        setCategories(filtersRes.data.categories || []);
        setLocations(filtersRes.data.locations || []);

        if (destRes) {
          const d: Destination = destRes.data.destination;
          setName(d.name || '');
          setDescription(d.description || '');
          setImages((d.images || []).filter(Boolean));
          setEstimatedBudget(d.estimated_budget != null ? String(d.estimated_budget) : '');
          setBestVisitSeason(d.best_visit_season || '');
          setCategoryId(toId(d.category_id));
          setLocationId(toId(d.location_id));
        }
      } catch (e) {
        setError(getApiErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, id]);

  async function uploadImages(files: FileList | File[] | null) {
    const list = files ? Array.from(files) : [];
    if (list.length === 0) return;
    const imagesOnly = list.filter((f) => f.type.startsWith('image/'));
    if (imagesOnly.length === 0) {
      setError('Please select valid image files (JPG, PNG, WebP, GIF, AVIF).');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of imagesOnly) {
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`"${file.name}" is too large. Maximum size is 10MB.`);
        }
        const form = new FormData();
        form.append('file', file);
        const { data } = await apiClient.post('/uploads/image', form);
        if (data?.url) uploaded.push(data.url as string);
      }
      if (uploaded.length) {
        setImages((prev) => [...prev, ...uploaded]);
        setSuccess(`${uploaded.length} image${uploaded.length > 1 ? 's' : ''} uploaded successfully.`);
        setTimeout(() => setSuccess(null), 2500);
      }
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (name.trim().length < 2) return setError('Name must be at least 2 characters.');
    if (description.trim().length < 10) return setError('Description must be at least 10 characters.');
    if (images.length === 0) return setError('Please upload at least one image.');
    if (!categoryId) return setError('Select a category.');
    if (!locationId) return setError('Select a location.');

    const payload: any = {
      name: name.trim(),
      description: description.trim(),
      images,
      best_visit_season: bestVisitSeason.trim() || undefined,
      category_id: categoryId,
      location_id: locationId,
    };
    if (estimatedBudget.trim()) {
      const n = Number(estimatedBudget);
      if (!Number.isFinite(n) || n <= 0) return setError('Estimated budget must be a positive number.');
      payload.estimated_budget = n;
    }

    setSaving(true);
    try {
      if (mode === 'create') {
        await apiClient.post('/destinations', payload);
        setSuccess('Destination created successfully.');
      } else if (id) {
        await apiClient.put(`/destinations/${id}`, payload);
        setSuccess('Destination updated successfully.');
      }
      setTimeout(() => {
        router.push('/destinations');
        router.refresh();
      }, 700);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell title={title} subtitle={subtitle}>
      <div className="rounded-3xl border border-sand-200/80 bg-white/95 p-5 shadow-[0_20px_50px_-30px_rgba(12,28,44,0.3)] sm:p-6">
        {loading ? (
          <div className="flex items-center gap-3 text-sm text-ink-500"><span className="h-5 w-5 animate-spin rounded-full border-2 border-sand-300 border-t-sea-500" />Loading formâ€¦</div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {error ? <div role="alert" className="rounded-2xl border border-terracotta-200 bg-terracotta-50 px-4 py-3 text-sm text-terracotta-700">{error}</div> : null}
            {success ? <div role="status" className="rounded-2xl border border-sea-200 bg-sea-50 px-4 py-3 text-sm font-medium text-sea-700">{success}</div> : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Destination name" htmlFor="dest-name" className="sm:col-span-2">
                <Input id="dest-name" value={name} onChange={(e) => setName(e.target.value)} className="bg-white" placeholder="e.g. Bali" />
              </Field>

              <div className="sm:col-span-2">
                <label htmlFor="dest-desc" className="mb-1.5 block text-sm font-semibold tracking-[-0.01em] text-ink-800">Description</label>
                <textarea
                  id="dest-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="block w-full rounded-2xl border border-sand-300/90 bg-white/95 px-4 py-3 text-[15px] leading-6 text-ink-900 shadow-[0_1px_0_rgba(12,28,44,0.02)] placeholder:text-ink-400/90 transition-all hover:border-sand-400 focus:border-sea-500 focus:outline-none focus:shadow-[0_0_0_4px_rgba(20,122,128,0.10)]"
                  placeholder="Describe the destination, highlights, and travel experienceâ€¦"
                />
              </div>

              <div>
                <label htmlFor="dest-category" className="mb-1.5 block text-sm font-semibold tracking-[-0.01em] text-ink-800">Category</label>
                <select
                  id="dest-category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="block min-h-[3rem] w-full rounded-2xl border border-sand-300/90 bg-white/95 px-4 py-3 text-[15px] text-ink-900 transition-all hover:border-sand-400 focus:border-sea-500 focus:outline-none focus:shadow-[0_0_0_4px_rgba(20,122,128,0.10)]"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="dest-location" className="mb-1.5 block text-sm font-semibold tracking-[-0.01em] text-ink-800">Location</label>
                <select
                  id="dest-location"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="block min-h-[3rem] w-full rounded-2xl border border-sand-300/90 bg-white/95 px-4 py-3 text-[15px] text-ink-900 transition-all hover:border-sand-400 focus:border-sea-500 focus:outline-none focus:shadow-[0_0_0_4px_rgba(20,122,128,0.10)]"
                >
                  <option value="">Select location</option>
                  {locations.map((l) => <option key={l._id} value={l._id}>{l.name}{l.country ? `, ${l.country}` : ''}</option>)}
                </select>
              </div>

              <Field label="Estimated budget (USD)" htmlFor="dest-budget">
                <Input id="dest-budget" type="number" min="0" step="1" value={estimatedBudget} onChange={(e) => setEstimatedBudget(e.target.value)} className="bg-white" placeholder="e.g. 1200" />
              </Field>

              <Field label="Best visit season" htmlFor="dest-season">
                <Input id="dest-season" value={bestVisitSeason} onChange={(e) => setBestVisitSeason(e.target.value)} className="bg-white" placeholder="e.g. April - October" />
              </Field>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold tracking-[-0.01em] text-ink-800">Images</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); if (!uploading) setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => { e.preventDefault(); setDragActive(false); if (!uploading) uploadImages(e.dataTransfer.files); }}
                  className={`rounded-2xl border-2 border-dashed p-5 transition ${dragActive ? 'border-sea-500 bg-sea-50/60' : 'border-sand-300 bg-sand-50/60'}`}
                >
                  <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sea-600 shadow-sm ring-1 ring-sand-200">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 16.5v1A2.5 2.5 0 0 0 6.5 20h11A2.5 2.5 0 0 0 20 17.5v-1M12 4v11m0-11 4 4m-4-4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink-800">Drag & drop images here</p>
                        <p className="text-xs text-ink-500">JPG, PNG, WebP, GIF, AVIF · up to 10MB each</p>
                      </div>
                    </div>
                    <label className={`inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition ${uploading ? 'bg-sea-400' : 'bg-sea-600 hover:bg-sea-700'}`}>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { uploadImages(e.target.files); e.target.value = ''; }} disabled={uploading} />
                      {uploading ? (
                        <span className="inline-flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />Uploading…</span>
                      ) : 'Choose files'}
                    </label>
                  </div>

                  {images.length > 0 ? (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {images.map((src, i) => (
                        <div key={`${src}-${i}`} className="group relative overflow-hidden rounded-xl border border-sand-200 bg-white shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`Destination image ${i + 1}`} className="h-28 w-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.25'; }} />
                          {i === 0 ? <span className="absolute left-2 top-2 rounded-md bg-sea-600/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">Cover</span> : null}
                          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                            <span className="truncate text-[10px] text-white/90">Image {i + 1}</span>
                            <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-ink-800 hover:bg-white">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-xl border border-sand-200 bg-white/70 px-4 py-6 text-center text-sm text-ink-500">No images uploaded yet. Upload at least one image to continue.</div>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-ink-400">At least one image is required. First image is used as the cover. Images are uploaded and stored in Cloudflare R2.</p>
              </div>
            </div>

            {(categories.length === 0 || locations.length === 0) ? (
              <div className="rounded-2xl border border-gold-200/70 bg-gold-100/30 px-4 py-3 text-sm text-ink-700">
                Categories and locations are required. If none are available, <a href="/categories" className="font-semibold text-sea-700 underline">add a category</a> and/or <a href="/locations" className="font-semibold text-sea-700 underline">add a location</a> first.
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3 pt-1">
              <Button type="submit" size="lg" disabled={saving || Boolean(success)}>
                {saving ? (mode === 'create' ? 'Creatingâ€¦' : 'Savingâ€¦') : (mode === 'create' ? 'Create destination' : 'Save changes')}
              </Button>
              <button
                type="button"
                onClick={() => router.push('/destinations')}
                className="inline-flex min-h-[3.25rem] items-center justify-center rounded-pill border border-ink-200 bg-white px-6 text-sm font-semibold text-ink-700 transition hover:border-sea-300 hover:bg-sand-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminShell>
  );
}

