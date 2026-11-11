'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@gtour/utils';
import { clearSession, readUser } from '@gtour/utils';
import { useEffect, useState } from 'react';
import type { AuthUserDto } from '@gtour/utils';

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000';

const NAV = [
  { href: '/', label: 'Overview', icon: 'overview' },
  { href: '/users', label: 'Users', icon: 'users' },
  { href: '/destinations', label: 'Destinations', icon: 'map' },
  { href: '/categories', label: 'Categories', icon: 'category' },
  { href: '/locations', label: 'Locations', icon: 'location' },
  { href: '/profile', label: 'Profile', icon: 'profile' },
] as const;

function Icon({ name, active }: { name: string; active: boolean }) {
  const cls = cn('h-[18px] w-[18px]', active ? 'text-sea-300' : 'text-slate-400');
  if (name === 'users')
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  if (name === 'map')
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z" /><path d="M9 3v15" /><path d="M15 6v15" />
      </svg>
    );
  if (name === 'dash')
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" />
      </svg>
    );
  if (name === 'profile')
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" /><path d="M4 20a8 8 0 0 1 16 0" />
      </svg>
    );
  if (name === 'category')
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
      </svg>
    );
  if (name === 'location')
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z" /><circle cx="12" cy="11" r="2.2" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5L12 4l9 7.5" /><path d="M5 10.5V20h14v-9.5" /><path d="M9 20v-5h6v5" />
    </svg>
  );
}

export default function AdminShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUserDto | null>(null);

  useEffect(() => {
    setUser(readUser());
  }, []);

  function logout() {
    clearSession();
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100dvh-4.5rem)] bg-[#F3F4F6]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col lg:flex-row">
        {/* Left sidebar */}
        <aside className="w-full shrink-0 border-b border-sand-200/80 bg-[#0F2438] lg:sticky lg:top-[4.5rem] lg:h-[calc(100dvh-4.5rem)] lg:w-[272px] lg:border-b-0 lg:border-r lg:border-[#1b3550]">
          <div className="flex h-full flex-col px-4 py-5 sm:px-5">
            <div className="mb-6 flex items-center gap-3 px-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sea-500 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(20,122,128,0.8)]">G</span>
              <div>
                <p className="font-display text-lg font-semibold leading-none text-white">GTour</p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-sea-200/80">Admin Console</p>
              </div>
            </div>

            <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white">
                  {(user?.name?.[0] || 'A').toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{user?.name || 'Administrator'}</p>
                  <p className="truncate text-xs text-slate-300">{user?.email || 'Signed in'}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-1">
              <p className="px-3 pb-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-400">Menu</p>
              {NAV.map((item) => {
                const active = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                      active
                        ? 'bg-white/12 text-white shadow-[inset_3px_0_0_#2fb7a6]'
                        : 'text-slate-300 hover:bg-white/8 hover:text-white'
                    )}
                  >
                    <Icon name={item.icon} active={active} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
              <a
                href={WEB_URL}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all hover:bg-white/10 hover:text-white"
              >
                Open public site
              </a>
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all hover:border-red-300/40 hover:bg-red-500/10 hover:text-white"
              >
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-6 flex flex-col gap-2 border-b border-sand-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-sea-700">Administration</p>
              <h1 className="mt-1 font-display text-2xl font-semibold text-ink-900 sm:text-3xl">{title}</h1>
              {subtitle ? <p className="mt-1.5 max-w-2xl text-sm text-ink-500">{subtitle}</p> : null}
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
