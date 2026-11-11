import AuthGuard from '@gtour/ui';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard requireAdmin>{children}</AuthGuard>;
}
