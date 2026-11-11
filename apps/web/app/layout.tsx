import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  weight: 'variable',
  axes: ['SOFT', 'WONK'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: {
    default: 'GTour — Discover your next journey',
    template: '%s · GTour',
  },
  description:
    'Discover destinations, find your stay, and book photographers and transport for every journey.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body
        suppressHydrationWarning
        className="flex min-h-screen flex-col bg-sand-50 font-sans text-ink-900"
      >
        <a href="#main-content" className="gtour-skip-link">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}