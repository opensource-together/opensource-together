import SkeletonProjectGrid from "./SkeletonProjectGrid";

export default function SkeletonHomepageViews() {
  return (
    <div className="space-y-4 md:space-y-5">
      <div className="mx-auto mt-4 flex flex-col items-center px-4 sm:px-6 md:mt-8 md:px-8 lg:px-0">
        {/* Hero Section Skeleton */}
        <div className="relative mx-auto w-full max-w-[1108px] rounded-4xl border border-black/5 bg-gray-100">
          <div className="flex h-[330px] flex-col items-center justify-center space-y-4">
            {/* New projects badge skeleton */}
            <div className="flex items-center gap-1">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-gray-300" />
              <div className="h-4 w-40 animate-pulse rounded-full bg-gray-300" />
            </div>

            {/* Title skeleton */}
            <div className="space-y-2 text-center">
              <div className="mx-auto h-12 w-96 animate-pulse rounded-lg bg-gray-300" />
              <div className="mx-auto h-12 w-80 animate-pulse rounded-lg bg-gray-300" />
            </div>

            {/* Filter search bar skeleton */}
            <div className="mt-4 flex h-14 w-[600px] animate-pulse items-center justify-between rounded-full bg-white px-4 shadow-md">
              <div className="flex items-center gap-6">
                <div className="h-5 w-5 rounded-full bg-gray-300" />
              </div>
              <div className="h-10 w-32 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid Section */}
      <div className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6 md:px-8 md:py-8 lg:px-12">
        <SkeletonProjectGrid />

        {/* Pagination skeleton */}
        <div className="mt-25 mb-50 flex items-center justify-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-8 animate-pulse rounded-full bg-gray-300"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
