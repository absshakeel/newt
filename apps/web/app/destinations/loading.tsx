import { CardSkeletonGrid, Skeleton } from '@gtour/ui';

export default function DestinationsLoading() {
  return (
    <div className="gtour-section">
      <div className="gtour-container">
        <div className="max-w-3xl space-y-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-full max-w-xl" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>
        <Skeleton className="mt-10 h-40 w-full rounded-panel" />
        <div className="mt-10">
          <CardSkeletonGrid count={9} />
        </div>
      </div>
    </div>
  );
}