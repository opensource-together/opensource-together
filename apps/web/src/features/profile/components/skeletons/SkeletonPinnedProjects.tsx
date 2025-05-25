import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonPinnedProjects() {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="flex w-full max-w-[731px] flex-col gap-4 rounded-2xl border border-[#000000]/10 bg-white p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-16 w-full max-w-[500px]" />
            </div>
            <Skeleton className="size-12 rounded-lg" />
          </div>

          <div className="flex flex-wrap gap-2">
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
