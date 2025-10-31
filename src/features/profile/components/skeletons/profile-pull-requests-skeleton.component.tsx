import { Skeleton } from "@/shared/components/ui/skeleton";

export function ProfilePullRequestsSkeleton() {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* Filters skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="hidden h-6 w-32 md:block" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-[140px] rounded-full" />
          <Skeleton className="h-9 w-[100px] rounded-full" />
        </div>
      </div>

      {/* Pull requests skeleton */}
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <PullRequestCardSkeleton key={index} />
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="mt-2 flex items-center justify-center gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-9 w-16" />
      </div>
    </div>
  );
}

function PullRequestCardSkeleton() {
  return (
    <div className="border-muted-black-stroke rounded-[20px] border px-5 py-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Badge and title skeleton */}
          <div className="mb-2 flex items-center gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-5 w-3/4" />
          </div>

          {/* Separator */}
          <div className="my-4">
            <Skeleton className="h-px w-full" />
          </div>

          {/* Footer skeleton */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              {/* Provider icon and text */}
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
              {/* Time skeleton */}
              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-3" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            {/* Repository path skeleton */}
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
