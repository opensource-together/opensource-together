import { Skeleton } from "@/shared/components/ui/skeleton";

/**
 * Renders a skeleton placeholder UI for pinned projects during loading states.
 *
 * Displays a header skeleton and three project card skeletons, each with placeholders for titles, descriptions, technology tags, and icons.
 */
export default function SkeletonPinnedProjects() {
  return (
    <div className="flex w-full max-w-[731px] flex-col items-center gap-4">
      <div className="mb-5 gap-1">
        <div className="h-7 w-32 animate-pulse rounded-md bg-gray-200" />
      </div>
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="w-full rounded-2xl border border-[#000000]/10 bg-white p-6 shadow-md"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full max-w-[500px]" />
            </div>
            <Skeleton className="size-12 rounded-lg" />
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
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
