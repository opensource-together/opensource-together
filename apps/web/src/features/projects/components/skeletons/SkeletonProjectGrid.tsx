import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonProjectGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col rounded-3xl border border-[black]/10 px-7.5 py-6 shadow-xs"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12.5 w-12.5 rounded-lg" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-6 w-32" />
                <div className="flex gap-1.5">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-4 rounded-xs" />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-end justify-center gap-1">
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
          <Skeleton className="mt-4 h-10" />
          <div className="my-4 border-t border-dashed border-[black]/10" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-2">
              {Array.from({ length: 2 }).map((_, k) => (
                <Skeleton key={k} className="h-4 w-16 rounded-full" />
              ))}
            </div>
            <Skeleton className="ml-auto h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
