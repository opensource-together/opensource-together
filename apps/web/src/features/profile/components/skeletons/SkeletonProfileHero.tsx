import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonProfileHero() {
  return (
    <div className="h-auto w-full rounded-3xl border border-[#000000]/10 bg-white p-8 sm:w-[540px] lg:w-[731.96px]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative mr-4">
            <Skeleton className="size-[85px] rounded-full" />
          </div>
          <div>
            <Skeleton className="mb-2 h-7 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <Skeleton className="mb-6 h-16 w-full" />

      {/* Line */}
      <div className="my-7 border-t border-dashed border-[black]/10" />

      <div className="mb-6">
        <Skeleton className="mb-4 h-6 w-40" />
        <div className="flex flex-wrap gap-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-6 w-20" />
          ))}
        </div>
      </div>

      {/* Line */}
      <div className="my-7 border-t border-dashed border-[black]/10" />

      <div>
        <div className="mb-7 flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-[30px] w-[86px]" />
          </div>
        </div>

        <div className="mb-4 flex w-full justify-center overflow-hidden">
          <div className="flex gap-0.5">
            {[...Array(46)].map((_, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-0.5">
                {[...Array(7)].map((_, dayIndex) => (
                  <Skeleton
                    key={dayIndex}
                    className="size-3 rounded-xs bg-gray-200"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <Skeleton className="h-4 w-60" />
      </div>
    </div>
  );
}
