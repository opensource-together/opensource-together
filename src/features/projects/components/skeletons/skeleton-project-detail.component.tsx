import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function SkeletonProjectDetail() {
  // Sidebar skeleton
  const sidebar = (
    <div className="w-full space-y-6">
      {/* Name */}
      <div>
        <Skeleton className="h-6 w-32" />
      </div>
      {/* Job title*/}
      <Skeleton className="h-4 w-28" />
      {/* Bio */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
      {/* Social links */}
      <div className="flex justify-start gap-3">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
      {/* More */}
      <div className="mt-14 space-y-2">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </div>
  );

  // Main desktop hero/header skeleton
  const hero = (
    <div>
      <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <Skeleton className="mr-4 h-16 w-16 rounded-xl" />
          <div>
            <Skeleton className="mb-1 h-8 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="mt-4">
        <Skeleton className="mb-1 h-4 w-full" />
        <Skeleton className="mb-1 h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </div>
  );

  // Mobile header skeleton
  const mobileHeader = (
    <div>
      <div className="flex flex-col items-start">
        <div className="flex items-center">
          <Skeleton className="mr-4 h-16 w-16 rounded-xl" />
          <div>
            <Skeleton className="mb-1 h-8 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="mt-4 mb-1 h-4 w-full" />
        <Skeleton className="mb-1 h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="mt-6 h-10 w-32" />
      </div>
    </div>
  );

  return (
    <TwoColumnLayout sidebar={sidebar} hero={hero} mobileHeader={mobileHeader}>
      {/* Tab bar skeleton */}
      <div className="flex flex-col gap-6">
        <div className="border-border inline-flex items-center border-b">
          <Skeleton className="mr-2 h-4 w-20" />
          <Skeleton className="mr-2 h-4 w-16" />
          <Skeleton className="mr-2 h-4 w-20" />
          <Skeleton className="mr-2 h-4 w-24" />
          <Skeleton className="mr-2 h-4 w-28" />
        </div>
        {/* Overview tab content skeleton */}
        <div className="mt-6 space-y-8">
          {/* Images slider skeleton */}
          <Skeleton className="h-32 w-full rounded-lg" />
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
