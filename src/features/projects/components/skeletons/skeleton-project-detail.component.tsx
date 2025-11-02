import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function SkeletonProjectDetail() {
  // Sidebar skeleton
  const sidebar = (
    <div className="w-full space-y-6">
      {/* Statistics */}
      <div>
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-5 w-3/5" />
      </div>
      {/* Tech stacks */}
      <div>
        <Skeleton className="mt-10 h-4 w-32" />
      </div>
      <div className="flex justify-start gap-3">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
      {/* Categories */}
      <div>
        <Skeleton className="mt-10 h-4 w-32" />
      </div>
      <div className="flex justify-start gap-3">
        <Skeleton className="h-5 w-2/5 rounded-full" />
        <Skeleton className="h-5 w-2/5 rounded-full" />
        <Skeleton className="h-5 w-2/5 rounded-full" />
      </div>
      {/* Contributors */}
      <div>
        <Skeleton className="mt-10 h-4 w-32" />
      </div>
      <div className="flex justify-start gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="-ml-5 h-8 w-8 rounded-full" />
        <Skeleton className="-ml-5 h-8 w-8 rounded-full" />
        <Skeleton className="-ml-5 h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="-mt-2 h-3 w-32" />
    </div>
  );

  // Main desktop hero/header skeleton
  const HeroSkeleton = ({ hideHeader }: { hideHeader?: boolean }) => (
    <div>
      {!hideHeader && (
        <>
          <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <Skeleton className="h-16 w-16 rounded-xl" />
              <div>
                <Skeleton className="mb-1 h-8 w-40" />
              </div>
            </div>
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
          <div className="mt-4">
            <Skeleton className="mb-1 h-4 w-full" />
            <Skeleton className="mb-1 h-4 w-4/5" />
          </div>
        </>
      )}
    </div>
  );

  const hero = <HeroSkeleton />;

  // Mobile header skeleton
  const mobileHeader = (
    <div>
      <div className="flex flex-col items-start">
        <div className="flex items-center">
          <Skeleton className="mr-4 size-12 rounded-xl" />
          <div>
            <Skeleton className="mb-1 h-8 w-40" />
          </div>
        </div>
        <Skeleton className="mt-4 mb-1 h-4 w-full" />
        <Skeleton className="mb-1 h-4 w-4/5" />
        <Skeleton className="mt-6 h-10 w-32 rounded-full" />
      </div>
    </div>
  );

  return (
    <TwoColumnLayout sidebar={sidebar} hero={hero} mobileHeader={mobileHeader}>
      {/* Tab bar skeleton */}
      <div className="flex flex-col gap-6">
        <div className="border-border inline-flex items-center border-b">
          <Skeleton className="mr-6 h-5 w-20" />
          <Skeleton className="mr-6 h-5 w-20" />
          <Skeleton className="mr-6 h-5 w-24" />
          <Skeleton className="mr-6 h-5 w-24" />
          <Skeleton className="mr-6 h-5 w-24" />
        </div>
        {/* Overview tab content skeleton */}
        <div className="mt-4 space-y-8">
          {/* Images slider skeleton */}
          <Skeleton className="h-72 w-full rounded-lg" />
          {/* README skeleton */}
          <Skeleton className="mb-2 h-12 w-2/3 rounded" />
          <Skeleton className="mb-1 h-4 w-full" />
          <Skeleton className="mb-1 h-4 w-5/6" />
          <Skeleton className="mb-6 h-4 w-3/4" />
          {/* Issues/recent activity blocks */}
          <Skeleton className="mb-2 h-10 w-2/3 rounded-lg" />
          <Skeleton className="mb-4 h-32 w-full rounded-lg" />
        </div>
        {/* Contributing tab skeleton */}
        <div className="mt-6 space-y-4">
          <Skeleton className="mb-2 h-10 w-2/3 rounded-lg" />
          <Skeleton className="mb-2 h-6 w-1/2" />
          <Skeleton className="mb-1 h-4 w-full" />
        </div>
        {/* Open Issues tab skeleton */}
        <div className="mt-6 space-y-2">
          <Skeleton className="mb-2 h-8 w-1/2 rounded" />
          <Skeleton className="mb-2 h-6 w-5/6" />
          <Skeleton className="mb-2 h-6 w-3/6" />
          <Skeleton className="mb-2 h-6 w-2/6" />
        </div>
        {/* Pull Requests tab skeleton */}
        <div className="mt-6 space-y-2">
          <Skeleton className="mb-2 h-8 w-1/2 rounded" />
          <Skeleton className="mb-2 h-6 w-5/6" />
          <Skeleton className="mb-2 h-6 w-3/6" />
          <Skeleton className="mb-2 h-6 w-2/6" />
        </div>
        {/* Contributors tab skeleton */}
        <div className="mt-6 space-y-2">
          <Skeleton className="mb-2 h-8 w-1/2 rounded" />
          <Skeleton className="mb-2 h-6 w-5/6" />
          <Skeleton className="mb-2 h-6 w-3/6" />
          <Skeleton className="mb-2 h-6 w-2/6" />
        </div>
      </div>
    </TwoColumnLayout>
  );
}
