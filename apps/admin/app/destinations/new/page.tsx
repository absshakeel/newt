import AuthGuard from '@gtour/ui';
import DestinationForm from '@/components/admin/DestinationForm';

export default function NewDestinationPage() {
  return <AuthGuard requireAdmin><DestinationForm mode="create" /></AuthGuard>;
}
