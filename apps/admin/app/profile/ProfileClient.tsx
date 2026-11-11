'use client';

import { useEffect, useState, type FormEvent } from 'react';
import AuthGuard from '@gtour/ui';
import { Button } from '@gtour/ui';
import { Field, Input } from '@gtour/ui';
import { apiClient, getApiErrorMessage } from '@gtour/utils';
import { readUser, saveSession, readToken } from '@gtour/utils';
import type { AuthUserDto } from '@gtour/utils';

type ProfileData = {
  bio?: string;
  preferred_language?: string;
  travel_preferences?: string[];
  profile_image?: string;
  date_of_birth?: string;
  address?: string;
};

export default function ProfileClient() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');

  const [bio, setBio] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [travelPreferences, setTravelPreferences] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageDragActive, setImageDragActive] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get('/auth/profile');
        const u = data.data?.user ?? data.user;
        const p = (data.data?.profile ?? data.profile ?? {}) as ProfileData;
        setName(u?.name ?? '');
        setEmail(u?.email ?? '');
        setPhone(u?.phone ?? '');
        setRole(u?.role ?? '');
        setStatus(u?.account_status ?? '');

        setBio(p.bio ?? '');
        setPreferredLanguage(p.preferred_language ?? '');
        setTravelPreferences(Array.isArray(p.travel_preferences) ? p.travel_preferences.join(', ') : '');
        setProfileImage(p.profile_image ?? '');
        setDateOfBirth(p.date_of_birth ? String(p.date_of_birth).slice(0, 10) : '');
        setAddress(p.address ?? '');

        // keep local session in sync
        const token = readToken();
        if (token && (u?.id || u?._id)) {
          const sessionUser: AuthUserDto = {
            id: u.id ?? u._id,
            email: u.email,
            name: u.name,
            role: u.role,
            account_status: u.account_status,
          };
          saveSession(sessionUser, token);
        }
      } catch (e) {
        setError(getApiErrorMessage(e));
        const cached = readUser();
        if (cached) {
          setName(cached.name);
          setEmail(cached.email);
          setRole(cached.role);
          setStatus(cached.account_status);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }

    const prefs = travelPreferences
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: name.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        preferred_language: preferredLanguage.trim(),
        travel_preferences: prefs,
        address: address.trim(),
      };
      const trimmedImage = profileImage.trim();
      payload.profile_image = trimmedImage; // empty string signals clear
      payload.date_of_birth = dateOfBirth ? new Date(dateOfBirth).toISOString() : '';

      const { data } = await apiClient.put('/auth/profile', payload);
      const u = data.data?.user ?? data.user;
      const p = (data.data?.profile ?? data.profile ?? {}) as ProfileData;

      setBio(p.bio ?? bio);
      setPreferredLanguage(p.preferred_language ?? preferredLanguage);
      setTravelPreferences(Array.isArray(p.travel_preferences) ? p.travel_preferences.join(', ') : travelPreferences);
      setProfileImage(p.profile_image ?? profileImage);
      setDateOfBirth(p.date_of_birth ? String(p.date_of_birth).slice(0, 10) : dateOfBirth);
      setAddress(p.address ?? address);

      const token = readToken();
      const sessionUser: AuthUserDto | null = u
        ? {
            id: u.id ?? u._id,
            email: u.email ?? email,
            name: u.name ?? name.trim(),
            role: u.role ?? role,
            account_status: u.account_status ?? status,
          }
        : readUser();
      if (token && sessionUser) {
        saveSession({ ...sessionUser, name: (u?.name ?? name).trim() }, token);
      }
      setSuccess('Profile updated successfully.');
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-[calc(100dvh-4.5rem)] bg-[#F8F3EA]">
        <div className="gtour-container py-10 sm:py-12">
          <div className="mx-auto max-w-5xl">
            <p className="gtour-eyebrow">Account</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">Your profile</h1>
            <p className="mt-2 text-sm text-ink-500 sm:text-base">View and update your account and profile information.</p>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
              <section className="rounded-3xl border border-sand-200/80 bg-white/95 p-5 shadow-[0_20px_50px_-30px_rgba(12,28,44,0.35)] sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-4 border-b border-sand-200 pb-4">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-ink-900">Edit profile</h2>
                    <p className="mt-1 text-sm text-ink-500">Update your account details and profile preferences, then save.</p>
                  </div>
                  <span className="inline-flex rounded-full bg-sea-50 px-3 py-1 text-xs font-semibold text-sea-700">Profile</span>
                </div>

                {loading ? (
                  <div className="flex items-center gap-3 text-sm text-ink-500"><span className="h-5 w-5 animate-spin rounded-full border-2 border-sand-300 border-t-sea-500" />Loading profile…</div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-5">
                    {error ? <div role="alert" className="rounded-2xl border border-terracotta-200 bg-terracotta-50 px-4 py-3 text-sm text-terracotta-700">{error}</div> : null}
                    {success ? <div role="status" className="rounded-2xl border border-sea-200 bg-sea-50 px-4 py-3 text-sm font-medium text-sea-700">{success}</div> : null}

                    <div>
                      <p className="mb-3 text-sm font-semibold text-ink-800">Account</p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Full name" htmlFor="profile-name" className="sm:col-span-2">
                          <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} className="bg-white" placeholder="Your full name" />
                        </Field>
                        <Field label="Email" htmlFor="profile-email" hint="Email cannot be changed here." className="sm:col-span-2">
                          <Input id="profile-email" value={email} disabled className="bg-sand-50" />
                        </Field>
                        <Field label="Phone" htmlFor="profile-phone">
                          <Input id="profile-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 0100" className="bg-white" />
                        </Field>
                        <Field label="Role" htmlFor="profile-role" hint="Assigned to your account.">
                          <Input id="profile-role" value={role} disabled className="bg-sand-50 capitalize" />
                        </Field>
                      </div>
                    </div>

                    <div className="border-t border-sand-200 pt-4">
                      <p className="mb-3 text-sm font-semibold text-ink-800">Profile details</p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label htmlFor="profile-bio" className="mb-1.5 block text-sm font-semibold tracking-[-0.01em] text-ink-800">Bio</label>
                          <textarea
                            id="profile-bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={4}
                            maxLength={500}
                            className="block w-full rounded-2xl border border-sand-300/90 bg-white/95 px-4 py-3 text-[15px] leading-6 text-ink-900 shadow-[0_1px_0_rgba(12,28,44,0.02)] placeholder:text-ink-400/90 transition-all hover:border-sand-400 focus:border-sea-500 focus:outline-none focus:shadow-[0_0_0_4px_rgba(20,122,128,0.10)]"
                            placeholder="Tell us a bit about yourself and your travel style…"
                          />
                          <p className="mt-1 text-xs text-ink-400">Up to 500 characters.</p>
                        </div>

                        <Field label="Preferred language" htmlFor="profile-language">
                          <Input id="profile-language" value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)} className="bg-white" placeholder="e.g. English" />
                        </Field>

                        <Field label="Date of birth" htmlFor="profile-dob">
                          <Input id="profile-dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="bg-white" />
                        </Field>

                        <Field label="Address" htmlFor="profile-address" className="sm:col-span-2">
                          <Input id="profile-address" value={address} onChange={(e) => setAddress(e.target.value)} className="bg-white" placeholder="City, Country" />
                        </Field>

                        <div className="sm:col-span-2">
                          <label className="mb-1.5 block text-sm font-semibold tracking-[-0.01em] text-ink-800">Profile image</label>
                          <div
                            onDragOver={(e) => { e.preventDefault(); if (!uploadingImage) setImageDragActive(true); }}
                            onDragLeave={() => setImageDragActive(false)}
                            onDrop={async (e) => {
                              e.preventDefault();
                              setImageDragActive(false);
                              const file = e.dataTransfer.files?.[0];
                              if (!file || uploadingImage) return;
                              if (!file.type.startsWith('image/')) { setError('Please drop a valid image file.'); return; }
                              if (file.size > 10 * 1024 * 1024) { setError('Image is too large. Maximum size is 10MB.'); return; }
                              setUploadingImage(true);
                              setError(null);
                              try {
                                const form = new FormData();
                                form.append('file', file);
                                const { data } = await apiClient.post('/uploads/image', form);
                                if (data?.url) setProfileImage(data.url as string);
                              } catch (err) {
                                setError(getApiErrorMessage(err));
                              } finally {
                                setUploadingImage(false);
                              }
                            }}
                            className={`rounded-2xl border-2 border-dashed p-4 transition ${imageDragActive ? 'border-sea-500 bg-sea-50/60' : 'border-sand-300 bg-sand-50/50'}`}
                          >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm">
                                {profileImage ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={profileImage} alt="Profile preview" className="h-full w-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.25'; }} />
                                ) : (
                                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-ink-400">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    <span className="text-[11px] font-medium">No photo</span>
                                  </div>
                                )}
                                {uploadingImage ? (
                                  <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-sand-300 border-t-sea-600" />
                                  </div>
                                ) : null}
                              </div>
                              <div className="flex-1 space-y-3">
                                <div>
                                  <p className="text-sm font-semibold text-ink-800">Upload a profile photo</p>
                                  <p className="text-xs text-ink-500">Drag & drop or choose a file. JPG, PNG, WebP, GIF, AVIF · max 10MB.</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <label className={`inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${uploadingImage ? 'bg-sea-400' : 'bg-sea-600 hover:bg-sea-700'}`}>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        if (file.size > 10 * 1024 * 1024) { setError('Image is too large. Maximum size is 10MB.'); e.target.value = ''; return; }
                                        setUploadingImage(true);
                                        setError(null);
                                        try {
                                          const form = new FormData();
                                          form.append('file', file);
                                          const { data } = await apiClient.post('/uploads/image', form);
                                          if (data?.url) setProfileImage(data.url as string);
                                        } catch (err) {
                                          setError(getApiErrorMessage(err));
                                        } finally {
                                          setUploadingImage(false);
                                          e.target.value = '';
                                        }
                                      }}
                                      disabled={uploadingImage}
                                    />
                                    {uploadingImage ? 'Uploading…' : (profileImage ? 'Replace photo' : 'Choose photo')}
                                  </label>
                                  {profileImage ? (
                                    <button type="button" onClick={() => setProfileImage('')} className="rounded-xl border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-sand-100">Remove</button>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="mt-1.5 text-xs text-ink-400">Upload a photo to set your profile image. Photos are stored securely in Cloudflare R2.</p>
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="profile-prefs" className="mb-1.5 block text-sm font-semibold tracking-[-0.01em] text-ink-800">Travel preferences</label>
                          <textarea
                            id="profile-prefs"
                            value={travelPreferences}
                            onChange={(e) => setTravelPreferences(e.target.value)}
                            rows={3}
                            className="block w-full rounded-2xl border border-sand-300/90 bg-white/95 px-4 py-3 text-[15px] leading-6 text-ink-900 shadow-[0_1px_0_rgba(12,28,44,0.02)] placeholder:text-ink-400/90 transition-all hover:border-sand-400 focus:border-sea-500 focus:outline-none focus:shadow-[0_0_0_4px_rgba(20,122,128,0.10)]"
                            placeholder="Beach, Mountains, Culture (comma or line separated)"
                          />
                          <p className="mt-1 text-xs text-ink-400">Comma or line separated.</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <Button type="submit" size="lg" disabled={saving}>
                        {saving ? 'Saving…' : 'Save profile'}
                      </Button>
                    </div>
                  </form>
                )}
              </section>

              <aside className="space-y-4">
                <div className="rounded-3xl border border-sand-200/80 bg-white/95 p-5 shadow-[0_16px_40px_-28px_rgba(12,28,44,0.3)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">Account status</p>
                  <p className="mt-2 inline-flex rounded-full bg-sea-50 px-3 py-1 text-sm font-semibold capitalize text-sea-700">{status || '—'}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">Role</p>
                  <p className="mt-1 text-sm font-medium capitalize text-ink-800">{(role || '—').replace('_', ' ')}</p>
                </div>
                <div className="rounded-3xl border border-sand-200/80 bg-white/95 p-5 shadow-[0_16px_40px_-28px_rgba(12,28,44,0.3)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">Profile preview</p>
                  {profileImage ? (
                    <div className="mt-3 overflow-hidden rounded-2xl border border-sand-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={profileImage} alt="Profile" className="h-36 w-full object-cover" />
                    </div>
                  ) : null}
                  <dl className="mt-3 space-y-2 text-sm">
                    <div><dt className="text-ink-400">Bio</dt><dd className="text-ink-700">{bio || '—'}</dd></div>
                    <div><dt className="text-ink-400">Language</dt><dd className="text-ink-700">{preferredLanguage || '—'}</dd></div>
                    <div><dt className="text-ink-400">DOB</dt><dd className="text-ink-700">{dateOfBirth || '—'}</dd></div>
                    <div><dt className="text-ink-400">Address</dt><dd className="text-ink-700">{address || '—'}</dd></div>
                    <div><dt className="text-ink-400">Preferences</dt><dd className="text-ink-700">{travelPreferences || '—'}</dd></div>
                  </dl>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
