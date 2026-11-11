import AuthGuard from '@gtour/ui';
import DestinationForm from '@/components/admin/DestinationForm';

export default async function EditDestinationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AuthGuard requireAdmin>
      <DestinationForm mode="edit" id={id} />
    </AuthGuard>
  );
}
