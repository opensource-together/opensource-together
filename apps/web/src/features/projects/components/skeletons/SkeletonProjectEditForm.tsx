export default function SkeletonProjectEditForm() {
  return (
    <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:gap-16">
      {/* Formulaire Skeleton - avec dimensions fixes */}
      <div className="relative flex w-[710px] flex-col gap-4 overflow-hidden rounded-3xl border border-black/5 bg-white p-10 shadow-[0_2px_5px_rgba(0,0,0,0.03)]">
        {/* Effet de vague avec animation exactement comme dans SkeletonProjectCard */}
        <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-gray-100 via-gray-200/70 to-gray-100"></div>

        {/* Header avec icône et titre */}
        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-[80px] w-[80px] rounded-sm bg-gray-200">
                {/* Suppression de la div qui cause des problèmes */}
              </div>
              <div className="h-6 w-48 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-4 w-28 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>
              <div className="h-5 w-4 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>
            </div>
          </div>
        </div>

        {/* Description - avec largeur fixe précise */}
        <div className="relative z-10 mt-4">
          <div className="mb-6 h-5 w-48 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>
          <div className="h-[269px] w-[600px] rounded-[10px] bg-gray-200 px-3 py-2"></div>
        </div>

        {/* Ligne en pointillés */}
        <div className="relative z-10 mt-4 mb-2 w-full border-t border-dashed border-black/10"></div>

        {/* Technical Stack */}
        <div className="relative z-10">
          <div className="mb-4 h-5 w-36 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>

          {/* Tech stack inputs */}
          <div className="flex flex-col gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="mb-2 flex items-center gap-2">
                <div className="h-[38px] w-full rounded-[7px] bg-gray-200"></div>
                <div className="h-[41px] w-[41px] rounded-[7px] bg-gray-200"></div>
              </div>
            ))}
          </div>

          {/* Add technology button */}
          <div className="mt-1 flex items-center gap-1.5">
            <div className="h-[20px] w-[20px] rounded-[2px] bg-gray-200"></div>
            <div className="h-4 w-28 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>
          </div>
        </div>

        {/* Submit button */}
        <div className="relative z-10 mt-4 self-end">
          <div className="h-[43px] w-[120px] rounded-[7px] bg-gray-200"></div>
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="flex w-[270px] flex-col gap-10">
        {/* Share Section */}
        <div>
          <div className="mb-3 h-6 w-24 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>
          <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-[15px] w-[15px] rounded-sm bg-gray-200"></div>
                <div className="h-4 w-36 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Stats Section */}
        <div>
          <div className="mb-3 h-6 w-40 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>
          <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-[15px] w-[15px] rounded-sm bg-gray-200"></div>
                <div className="h-4 w-36 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
