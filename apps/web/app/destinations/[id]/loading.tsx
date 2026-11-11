import { Skeleton } from '@gtour/ui';

export default function DestinationDetailLoading() {
  return (
    <div>
      <Skeleton className="min-h-[62vh] w-full rounded-none" />
      <div className="gtour-section">
        <div className="gtour-container grid gap-12 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-7">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full max-w-lg" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
          <div className="space-y-4 lg:col-span-5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-24 w-full rounded-card" />
            <Skeleton className="h-24 w-full rounded-card" />
            <Skeleton className="h-40 w-full rounded-panel" />
          </div>
        </div>
      </div>
    </div>
  );
}