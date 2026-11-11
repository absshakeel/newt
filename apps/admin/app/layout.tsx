import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap', weight: 'variable' });

export const metadata: Metadata = {
  title: { default: 'GTour Admin', template: '%s | GTour Admin' },
  description: 'GTour administration console',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body
        suppressHydrationWarning
        className="min-h-dvh bg-[#F3F4F6] font-sans text-ink-900 antialiased"
      >
        {children}
      </body>
    </html>
  );
}
