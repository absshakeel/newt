import Link from 'next/link';

const SERVICE_LINKS = [
  { href: '/destinations', label: 'Destinations' },
  { href: '/hotels', label: 'Hotels' },
  { href: '/photographers', label: 'Photographers' },
  { href: '/vehicles', label: 'Vehicles' },
];

const COMPANY_LINKS = [
  { href: '/#provider', label: 'Become a Provider' },
  { href: '/login', label: 'Sign in' },
  { href: '/register', label: 'Create an account' },
];

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy policy' },
  { href: '/terms', label: 'Terms & conditions' },
];

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-ink-100 bg-sand-100">
      <div className="gtour-container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sea-500 text-white">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.9 6h-2.5a15.9 15.9 0 00-1.2-3.1A8 8 0 0118.9 8zM12 4.2c.6.9 1.2 2 1.6 3.8H10.4c.4-1.8 1-2.9 1.6-3.8zM4.3 14a7.9 7.9 0 010-4h2.9a19.4 19.4 0 000 4zm.8 2h2.5c.3 1.1.7 2.2 1.2 3.1A8 8 0 015.1 16zm2.5-8H5.1a8 8 0 013.7-3.1A15.9 15.9 0 007.6 8zM12 19.8c-.6-.9-1.2-2-1.6-3.8h3.2c-.4 1.8-1 2.9-1.6 3.8zm1.9-5.8H10.1a17.4 17.4 0 010-4h3.8a17.4 17.4 0 010 4zm.6 5.1c.5-.9.9-2 1.2-3.1h2.5a8 8 0 01-3.7 3.1zm1.7-5.1a19.4 19.4 0 000-4h2.9a7.9 7.9 0 010 4z" />
                </svg>
              </span>
              <span className="font-display text-lg font-semibold text-ink-900">GTour</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-500">
              Destination discovery, stays, photographers, and transport in one platform for the
              Global Tourism Platform.
            </p>
          </div>

          <FooterColumn title="Services" links={SERVICE_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <FooterColumn title="Legal" links={LEGAL_LINKS} />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink-200/70 pt-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Global Tourism Platform. All rights reserved.</p>
          <p>
            Photography licensed via{' '}
            <a
              href="https://commons.wikimedia.org"
              className="font-medium text-sea-600 underline decoration-sea-300 underline-offset-2 hover:text-sea-700"
              rel="noreferrer noopener"
              target="_blank"
            >
              Wikimedia Commons
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-ink-600 transition-colors duration-200 hover:text-sea-600"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}