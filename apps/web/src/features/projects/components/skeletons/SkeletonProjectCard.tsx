export default function SkeletonProjectCard() {
  return (
    <div className="group relative h-[207px] w-full max-w-[731px] overflow-hidden rounded-[20px] border border-slate-200 bg-white px-[12px] py-[12px] shadow-md transition duration-200 ease-in-out">
      {/* Effet de vague animé avec un meilleur contraste */}
      <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-gray-100 via-gray-200/70 to-gray-100"></div>

      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {/* Avatar placeholder - CARRÉ et non rond */}
        <div className="flex items-center gap-3">
          <div className="relative h-[50px] w-[50px] overflow-hidden rounded-sm bg-gray-200">
            {/* Animation de pulsation au sein de l'avatar */}
            <div className="absolute inset-0 animate-[pulse_0.7s_ease-in-out_infinite] bg-gradient-to-r from-gray-200 to-gray-300"></div>
          </div>
          <div className="h-4 w-32 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>
        </div>

        {/* Bookmark icon placeholder */}
        <div className="h-6 w-6 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>
      </div>

      {/* Card body */}
      <div className="space-y-4 p-5">
        {/* Title */}
        <div className="h-6 w-3/4 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>

        {/* Tech stack placeholders */}
        <div className="flex flex-wrap gap-2 py-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-6 w-16 animate-[pulse_0.7s_ease-in-out_infinite] rounded-[3px] bg-gray-200"
            ></div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4">
        {/* Creator info placeholder - CARRÉ et non rond */}
        <div className="flex items-center space-x-2">
          <div className="relative h-7 w-7 overflow-hidden rounded-sm bg-gray-200">
            {/* Animation de pulsation au sein de l'avatar */}
            <div className="absolute inset-0 animate-[pulse_0.7s_ease-in-out_infinite] bg-gradient-to-r from-gray-200 to-gray-300"></div>
          </div>
          <div className="h-3 w-20 animate-[pulse_0.7s_ease-in-out_infinite] rounded bg-gray-200"></div>
        </div>

        {/* Status placeholder */}
        <div className="h-6 w-20 animate-[pulse_0.7s_ease-in-out_infinite] rounded-[3px] bg-gray-200"></div>
      </div>
    </div>
  );
}
