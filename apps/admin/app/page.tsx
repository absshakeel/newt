import AuthGuard from '@gtour/ui';
import AdminShell from '@/components/admin/AdminShell';
import Link from 'next/link';

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000';

const cards = [
  {
    href: '/users',
    title: 'Users',
    desc: 'View registered accounts, review roles and statuses, and manage user access.',
    meta: 'User management',
    external: false,
  },
  {
    href: '/destinations',
    title: 'Destinations',
    desc: 'Create, edit, and archive destination listings shown across the platform.',
    meta: 'Content management',
    external: false,
  },
  {
    href: '/categories',
    title: 'Categories',
    desc: 'Create and manage destination categories used across listings.',
    meta: 'Taxonomy',
    external: false,
  },
  {
    href: '/locations',
    title: 'Locations',
    desc: 'Create and manage destination locations used across listings.',
    meta: 'Taxonomy',
    external: false,
  },
  {
    href: '/profile',
    title: 'My profile',
    desc: 'Update your administrator account details and personal profile information.',
    meta: 'Account',
    external: false,
  },
  {
    href: `${WEB_URL}/destinations`,
    title: 'Public site',
    desc: 'Open the traveller-facing destination experience in a new tab.',
    meta: 'Preview',
    external: true,
  },
];

export default function AdminOverviewPage() {
  return (
    <AuthGuard requireAdmin>
      <AdminShell title="Overview" subtitle="Manage users, destinations, and your administrator account from one place.">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const cls = "group flex h-full flex-col rounded-2xl border border-sand-200/90 bg-white p-5 shadow-[0_10px_30px_-20px_rgba(12,28,44,0.35)] transition-all hover:-translate-y-0.5 hover:border-sea-200 hover:shadow-[0_18px_40px_-24px_rgba(12,28,44,0.4)]";
          const inner = (
            <>
              <span className="inline-flex w-fit rounded-full bg-sand-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500">
                {card.meta}
              </span>
              <h2 className="mt-3 font-display text-xl font-semibold text-ink-900">{card.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{card.desc}</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-sea-700 transition-colors group-hover:text-sea-800">
                Open
                <svg viewBox="0 0 20 20" className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M5 10h10M11 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </>
          );
          return card.external ? (
            <a key={card.href} href={card.href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
          ) : (
            <Link key={card.href} href={card.href} className={cls}>{inner}</Link>
          );
        })}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-sand-200/90 bg-white p-5 shadow-[0_10px_30px_-20px_rgba(12,28,44,0.3)] lg:col-span-2">
          <h3 className="font-display text-lg font-semibold text-ink-900">Quick actions</h3>
          <p className="mt-1 text-sm text-ink-500">Common administrative tasks.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/users" className="rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-sea-300 hover:bg-sand-50">
              Manage users
            </Link>
            <Link href="/destinations" className="rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-sea-300 hover:bg-sand-50">
              Manage destinations
            </Link>
            <Link href="/destinations/new" className="rounded-xl bg-sea-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sea-700">
              Add destination
            </Link>
            <Link href="/categories" className="rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-sea-300 hover:bg-sand-50">
              Manage categories
            </Link>
            <Link href="/locations" className="rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-sea-300 hover:bg-sand-50">
              Manage locations
            </Link>
          </div>
        </section>
        <section className="rounded-2xl border border-sand-200/90 bg-white p-5 shadow-[0_10px_30px_-20px_rgba(12,28,44,0.3)]">
          <h3 className="font-display text-lg font-semibold text-ink-900">Workspace</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            Use the navigation to manage platform data and content. Changes you make here affect what travellers and providers see.
          </p>
        </section>
        </div>
      </AdminShell>
    </AuthGuard>
  );
}

