import { Skeleton } from "@/shared/components/ui/skeleton";

/**
 * Renders a skeleton placeholder for a project card to indicate loading state.
 *
 * Displays animated skeleton elements simulating the layout of a project card, including avatar, title, tech stack tags, creator info, and status.
 */
export default function SkeletonProjectCard() {
  return (
    <div className="group relative h-[207px] w-full max-w-[731px] overflow-hidden rounded-[20px] border border-slate-200 bg-white px-[12px] py-[12px] shadow-md transition duration-200 ease-in-out">
      {/* Effet de vague animé avec un meilleur contraste */}
      <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-gray-100 via-gray-200/70 to-gray-100" />

      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {/* Avatar et titre */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-[50px] w-[50px] rounded-sm" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Bookmark icon placeholder */}
        <Skeleton className="h-6 w-6" />
      </div>

      {/* Card body */}
      <div className="space-y-4 p-5">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />

        {/* Tech stack placeholders */}
        <div className="flex flex-wrap gap-2 py-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-16 rounded-[3px]" />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4">
        {/* Creator info */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-7 w-7 rounded-sm" />
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Status */}
        <Skeleton className="h-6 w-20 rounded-[3px]" />
      </div>
    </div>
  );
}
