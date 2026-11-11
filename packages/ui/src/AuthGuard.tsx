'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { readToken, readUser, SESSION_EVENT } from '@gtour/utils';
import type { AuthUserDto } from '@gtour/utils';

export default function AuthGuard({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AuthUserDto | null>(null);

  useEffect(() => {
    const check = () => {
      const token = readToken();
      const current = readUser();
      if (!token || !current) {
        router.replace('/login');
        return;
      }
      if (requireAdmin && current.role !== 'admin') {
        router.replace('/dashboard');
        return;
      }
      setUser(current);
      setReady(true);
    };

    check();
    window.addEventListener(SESSION_EVENT, check);
    window.addEventListener('storage', check);
    return () => {
      window.removeEventListener(SESSION_EVENT, check);
      window.removeEventListener('storage', check);
    };
  }, [requireAdmin, router]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-ink-500">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-sand-300 border-t-sea-500" />
          Checking access…
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
