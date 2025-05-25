import { SkeletonProjectFilters } from "../ProjectFilters";
import SkeletonProjectGrid from "./SkeletonProjectGrid";

export default function SkeletonHomepageViews() {
  return (
    <div className="space-y-4 pb-10 md:space-y-5">
      <div className="mx-auto mt-4 flex flex-col items-center px-4 sm:px-6 md:mt-8 md:px-8 lg:px-0">
        {/* Billboard skeleton */}
        <div className="relative flex h-[373px] w-[1116px] animate-pulse items-center justify-center overflow-hidden rounded-[30px] border border-[#000000]/10 bg-gray-200">
          <div className="absolute bottom-8 left-10 text-left">
            <div className="h-10 w-64 rounded bg-gray-300"></div>
            <div className="mt-2 h-4 w-96 rounded bg-gray-300"></div>
          </div>
          <div className="absolute right-10 bottom-12 flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gray-300"></div>
            <div className="h-10 w-10 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6 md:px-8 md:py-8 lg:px-12">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <SkeletonProjectFilters count={4} />
          <div className="h-[35px] w-full max-w-[613px] animate-pulse rounded-sm bg-gray-200"></div>
        </div>

        <SkeletonProjectGrid />

        {/* Pagination skeleton */}
        <div className="mt-25 flex animate-pulse items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-8 rounded bg-gray-200"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
