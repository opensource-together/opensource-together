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
              <div className="h-12.5 w-12.5 animate-pulse rounded-lg bg-gray-200"></div>
              <div className="flex flex-col gap-1">
                <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div
                      key={j}
                      className="h-4 w-4 animate-pulse rounded bg-gray-200"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-end justify-center gap-1">
              <div className="h-6 w-16 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
          <div className="mt-4 h-10 animate-pulse rounded bg-gray-200"></div>
          <div className="my-4 border-t border-dashed border-[black]/10"></div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
            <div className="flex gap-2">
              {Array.from({ length: 2 }).map((_, k) => (
                <div
                  key={k}
                  className="h-4 w-16 animate-pulse rounded-full bg-gray-200"
                ></div>
              ))}
            </div>
            <div className="ml-auto h-4 w-24 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
