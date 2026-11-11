'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import AuthGuard from '@gtour/ui';
import { readUser } from '@gtour/utils';
import type { AuthUserDto } from '@gtour/utils';

const quickLinks = [
  { href: '/destinations', title: 'Explore destinations', desc: 'Browse and discover places to visit.', tone: 'bg-sea-50 text-sea-700' },
  { href: '/hotels', title: 'Find stays', desc: 'Search hotels and plan your stay.', tone: 'bg-gold-100/60 text-ink-800' },
  { href: '/photographers', title: 'Photographers', desc: 'Discover photography services.', tone: 'bg-sand-100 text-ink-700' },
  { href: '/vehicles', title: 'Transport', desc: 'Find vehicles for your journey.', tone: 'bg-terracotta-50 text-terracotta-700' },
];

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUserDto | null>(null);
  useEffect(() => { setUser(readUser()); }, []);

  return (
    <AuthGuard>
      <div className="min-h-[calc(100dvh-4.5rem)] bg-[#F8F3EA]">
        <div className="gtour-container py-10 sm:py-12">
          <div className="mx-auto max-w-5xl">
            <p className="gtour-eyebrow">Tourist dashboard</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
              Welcome{user?.name ? `, ${user.name.split(/\s+/)[0]}` : ''}.
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-ink-500 sm:text-base">
              Manage your journey from one place — explore destinations, plan stays, and keep your profile up to date.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {quickLinks.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group rounded-3xl border border-sand-200/80 bg-white/95 p-5 shadow-[0_16px_40px_-28px_rgba(12,28,44,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-28px_rgba(12,28,44,0.4)]"
                >
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${card.tone}`}>Explore</span>
                  <h2 className="mt-3 font-display text-xl font-semibold text-ink-900">{card.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{card.desc}</p>
                  <span className="mt-4 inline-flex text-sm font-semibold text-sea-700 group-hover:text-sea-800">Open →</span>
                </Link>
              ))}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_340px]">
              <div className="rounded-3xl border border-sand-200/80 bg-white/95 p-5 shadow-[0_16px_40px_-28px_rgba(12,28,44,0.3)] sm:p-6">
                <h3 className="font-semibold text-ink-900">Getting started</h3>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  <li>• Search and filter destinations by travel style and location.</li>
                  <li>• Open a destination to view details, images, and related options.</li>
                  <li>• Keep your profile information current for a smoother experience.</li>
                </ul>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href="/destinations" className="inline-flex min-h-[2.75rem] items-center justify-center rounded-pill bg-sea-500 px-5 text-sm font-semibold text-white transition hover:bg-sea-600">Browse destinations</Link>
                  <Link href="/profile" className="inline-flex min-h-[2.75rem] items-center justify-center rounded-pill border border-ink-200 bg-white px-5 text-sm font-semibold text-ink-700 transition hover:border-sea-300 hover:bg-sand-50">View profile</Link>
                </div>
              </div>
              <div className="rounded-3xl border border-sand-200/80 bg-white/95 p-5 shadow-[0_16px_40px_-28px_rgba(12,28,44,0.3)]">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">Signed in as</p>
                <p className="mt-2 text-lg font-semibold text-ink-900">{user?.name || 'Traveller'}</p>
                <p className="mt-0.5 text-sm text-ink-500">{user?.email || ''}</p>
                <div className="mt-4 space-y-2 text-sm">
                  <p><span className="text-ink-400">Role:</span> <span className="font-medium capitalize text-ink-800">{user?.role || '—'}</span></p>
                  <p><span className="text-ink-400">Status:</span> <span className="font-medium capitalize text-sea-700">{user?.account_status || '—'}</span></p>
                </div>
                {user?.role === 'admin' ? (
                  <Link href="/admin" className="mt-4 inline-flex w-full min-h-[2.75rem] items-center justify-center rounded-pill bg-ink-900 px-5 text-sm font-semibold text-sand-50 transition hover:bg-ink-800">Open admin panel</Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
