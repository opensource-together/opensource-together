import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonPinnedProjects() {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[731px]">
      <div className="mb-5 gap-1">
          <div className="h-7 w-32 animate-pulse rounded-md bg-gray-200" />
        </div>
      {[...Array(3)].map((_, index) => (
        <div key={index} className="w-full bg-white p-6 rounded-2xl border border-[#000000]/10 shadow-md">
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full max-w-[500px]" />
            </div>
            <Skeleton className="size-12 rounded-lg" />
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {[...Array(3)].map((_, techIndex) => (
              <Skeleton key={techIndex} className="h-6 w-20" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, iconIndex) => (
              <Skeleton key={iconIndex} className="size-6" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
