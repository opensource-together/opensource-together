import { Skeleton } from "@/shared/components/ui/skeleton";

export default function SkeletonProfileView() {
  return (
    <div className="mx-7 mt-2 mb-20 flex max-w-[1007px] flex-col gap-8 md:mt-13.5 lg:mx-auto">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-25">
        {/* Mobile header skeleton */}
        <div className="md:hidden">
          <div>
            <div className="flex flex-col items-start">
              <div className="flex items-center">
                <div className="mr-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                </div>
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
        </div>
        {/* Sidebar skeleton */}
        <div className="w-full md:w-[260px] md:shrink-0">
          <div className="w-full space-y-6">
            {/* Name */}
            <div className="">
              <Skeleton className="h-6 w-32" />
            </div>

            {/* Job title */}
            <div className="">
              <Skeleton className="h-4 w-28" />
            </div>

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

            {/* Social links */}
            <div className="mt-14 space-y-2">
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="flex w-full flex-col gap-8 md:max-w-[677px] md:min-w-0 md:flex-1">
          {/* Hero skeleton */}
          <div className="hidden md:block">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                  </div>
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
          </div>

          {/* Tabs skeleton */}
          <div className="flex flex-col gap-6">
            {/* Tabs skeleton */}
            <div className="border-border inline-flex items-center border-b">
              <Skeleton className="mr-2 h-4 w-20" />
              <Skeleton className="mr-2 h-4 w-16" />
              <Skeleton className="mr-2 h-4 w-20" />
            </div>

            {/* Tab content skeleton */}
            <div className="mt-6 space-y-6">
              {/* GitHub Calendar skeleton */}
              <div className="mb-2 w-full">
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>

              {/* Pinned Projects skeleton */}
              <div className="mt-12 flex w-full">
                <div className="w-full space-y-4">
                  <Skeleton className="h-6 w-40" />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-48 w-full rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
