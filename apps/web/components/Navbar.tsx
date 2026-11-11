'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@gtour/utils';
import { ButtonLink } from '@gtour/ui';
import { SESSION_EVENT, clearSession, readUser } from '@gtour/utils';
import type { AuthUserDto } from '@gtour/utils';

const NAV_LINKS = [
  { href: '/destinations', label: 'Explore' },
  { href: '/hotels', label: 'Hotels' },
  { href: '/photographers', label: 'Photographers' },
  { href: '/vehicles', label: 'Vehicles' },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUserDto | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sync = () => setUser(readUser());
    sync();
    window.addEventListener(SESSION_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(SESSION_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!userMenuRef.current) return;
      if (!userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setUserMenuOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  function handleLogout() {
    clearSession();
    setUser(null);
    setMenuOpen(false);
    setUserMenuOpen(false);
    router.push('/');
    router.refresh();
  }

  const firstName = user?.name?.trim().split(/\s+/)[0] || 'Account';
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001';
  const dashboardHref = user?.role === 'admin' ? adminUrl : '/dashboard';
  const dashboardLabel = user?.role === 'admin' ? 'Admin panel' : 'Dashboard';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-premium',
        scrolled
          ? 'border-b border-ink-100/70 bg-sand-50/90 shadow-soft backdrop-blur-md'
          : 'border-b border-transparent bg-sand-50/70 backdrop-blur-sm'
      )}
    >
      <nav aria-label="Main" className="gtour-container">
        <div className="flex h-18 items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-pill py-2 text-ink-900"
            aria-label="GTour home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sea-500 text-white transition-transform duration-300 ease-premium group-hover:scale-105">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.9 6h-2.5a15.9 15.9 0 00-1.2-3.1A8 8 0 0118.9 8zM12 4.2c.6.9 1.2 2 1.6 3.8H10.4c.4-1.8 1-2.9 1.6-3.8zM4.3 14a7.9 7.9 0 010-4h2.9a19.4 19.4 0 000 4zm.8 2h2.5c.3 1.1.7 2.2 1.2 3.1A8 8 0 015.1 16zm2.5-8H5.1a8 8 0 013.7-3.1A15.9 15.9 0 007.6 8zM12 19.8c-.6-.9-1.2-2-1.6-3.8h3.2c-.4 1.8-1 2.9-1.6 3.8zm1.9-5.8H10.1a17.4 17.4 0 010-4h3.8a17.4 17.4 0 010 4zm.6 5.1c.5-.9.9-2 1.2-3.1h2.5a8 8 0 01-3.7 3.1zm1.7-5.1a19.4 19.4 0 000-4h2.9a7.9 7.9 0 010 4z" />
              </svg>
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">GTour</span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'rounded-pill px-4 py-2 text-sm font-medium transition-colors duration-200',
                      active
                        ? 'bg-sea-100 text-sea-700'
                        : 'text-ink-600 hover:bg-sand-200/70 hover:text-ink-900'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            {!user ? (
              <li>
                <Link
                  href="/register?role=provider"
                  className="rounded-pill px-4 py-2 text-sm font-medium text-ink-600 transition-colors duration-200 hover:bg-sand-200/70 hover:text-ink-900"
                >
                  Become a Provider
                </Link>
              </li>
            ) : null}
          </ul>

          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((o) => !o)}
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  className="flex items-center gap-2.5 rounded-pill border border-sand-300/80 bg-white/80 py-1.5 pl-1.5 pr-3 text-sm font-medium text-ink-800 shadow-[0_1px_0_rgba(12,28,44,0.02)] transition-all hover:border-sea-300 hover:bg-white"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sea-500 text-xs font-semibold text-white">
                    {firstName.charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[8rem] truncate">{firstName}</span>
                  <svg aria-hidden="true" viewBox="0 0 20 20" className={cn('h-4 w-4 text-ink-400 transition-transform', userMenuOpen && 'rotate-180')} fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {userMenuOpen ? (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-sand-200/90 bg-white/98 p-2 shadow-[0_24px_60px_-24px_rgba(12,28,44,0.35)] backdrop-blur-md"
                  >
                    <div className="mb-1 rounded-xl bg-sand-50 px-3 py-2.5">
                      <p className="truncate text-sm font-semibold text-ink-900">{user.name}</p>
                      <p className="truncate text-xs text-ink-500">{user.email}</p>
                      <p className="mt-1 inline-flex rounded-full bg-sea-50 px-2 py-0.5 text-[11px] font-semibold capitalize text-sea-700">{user.role.replace('_', ' ')}</p>
                    </div>
                    {user.role === 'admin' ? (
                      <a href={dashboardHref} role="menuitem" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-sand-100 hover:text-ink-900">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-ink-500" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></svg>
                        {dashboardLabel}
                      </a>
                    ) : (
                      <Link href={dashboardHref} role="menuitem" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-sand-100 hover:text-ink-900">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-ink-500" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></svg>
                        {dashboardLabel}
                      </Link>
                    )}
                    <Link href="/profile" role="menuitem" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-sand-100 hover:text-ink-900">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 text-ink-500" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4" /><path d="M4 20a8 8 0 0 1 16 0" /></svg>
                      Profile settings
                    </Link>
                    <div className="my-1 h-px bg-sand-200" />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-terracotta-700 transition hover:bg-terracotta-50"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <ButtonLink href="/login" variant="ghost" size="sm">
                  Login
                </ButtonLink>
                <ButtonLink href="/register" variant="primary" size="sm">
                  Get Started
                </ButtonLink>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 bg-white/80 text-ink-800 transition-colors hover:border-sea-400 lg:hidden"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 stroke-current"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <div
          id="mobile-nav"
          className="border-t border-ink-100 bg-sand-50/95 shadow-lift backdrop-blur-md lg:hidden"
        >
          <ul className="gtour-container flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-sand-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {!user ? (
              <li>
                <Link
                  href="/register?role=provider"
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-sand-200"
                >
                  Become a Provider
                </Link>
              </li>
            ) : null}
            {user ? (
              <>
                <li className="mt-2 rounded-2xl bg-sand-100/70 px-4 py-3">
                  <p className="text-sm font-semibold text-ink-900">{user.name}</p>
                  <p className="text-xs text-ink-500">{user.email}</p>
                </li>
                <li>
                  {user.role === 'admin' ? (
                    <a href={dashboardHref} className="block rounded-2xl px-4 py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-sand-200">
                      {dashboardLabel}
                    </a>
                  ) : (
                    <Link href={dashboardHref} className="block rounded-2xl px-4 py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-sand-200">
                      {dashboardLabel}
                    </Link>
                  )}
                </li>
                <li>
                  <Link href="/profile" className="block rounded-2xl px-4 py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-sand-200">
                    Profile settings
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-terracotta-700 transition-colors hover:bg-terracotta-50"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="mt-2 flex gap-3 px-1">
                <ButtonLink href="/login" variant="outline" size="md" className="flex-1">
                  Login
                </ButtonLink>
                <ButtonLink href="/register" variant="primary" size="md" className="flex-1">
                  Get Started
                </ButtonLink>
              </li>
            )}
          </ul>
        </div>
      ) : null}
    </header>
  );
}