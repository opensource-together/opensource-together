import { useRef, useState } from "react";

import { ContributionGraph } from "../types/profile.type";

interface GithubCalendarProps {
  contributionGraph?: ContributionGraph;
  contributionsCount?: number;
}

interface TooltipData {
  date: string;
  count: number;
  level: number;
}

export default function GithubCalendar({
  contributionGraph,
}: GithubCalendarProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const getSquareColor = (level: number): string => {
    switch (level) {
      case 0:
        return "bg-[#E8EAEE]";
      case 1:
        return "bg-[#8EC5FF]";
      case 2:
        return "bg-[#51A2FF]";
      case 3:
        return "bg-[#2B7FFF]";
      case 4:
        return "bg-[#193CB8]";
      default:
        return "bg-[#E8EAEE]";
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltip) {
      setTooltipPosition({ x: e.clientX + 10, y: e.clientY - 10 });
    }
  };

  const handleMouseEnter = (day: TooltipData, e: React.MouseEvent) => {
    setTooltip(day);
    setTooltipPosition({ x: e.clientX + 10, y: e.clientY - 10 });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  if (
    !contributionGraph ||
    !contributionGraph.weeks ||
    contributionGraph.weeks.length === 0
  ) {
    return (
      <div className="w-full max-w-full overflow-hidden">
        <div>
          <h3 className="mb-4 text-lg font-medium tracking-tight text-black">
            Activité de contribution Github
          </h3>
          <div className="flex h-[87px] w-full max-w-[598.07px] items-center justify-center rounded-lg border border-black/5 p-2">
            <p className="text-sm text-gray-500">
              Aucune donnée de contribution Github disponible
            </p>
          </div>
        </div>
      </div>
    );
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const days = ["Mon", "Wed", "Fri"];

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div>
        <h3 className="mb-4 text-lg font-medium tracking-tight text-black">
          Activité de contribution Github
        </h3>

        <div className="relative">
          <div className="mb-2 flex px-2">
            {months.map((month, index) => (
              <div key={index} className="flex-1 text-center">
                <span className="text-[6px] text-black/20 md:text-[8px]">
                  {month}
                </span>
              </div>
            ))}
          </div>

          <div className="flex">
            <div className="mr-1 flex flex-col justify-between py-1 md:mr-2">
              {days.map((day, index) => (
                <span
                  key={index}
                  className="text-[6px] text-black/20 md:text-[8px]"
                >
                  {day}
                </span>
              ))}
            </div>

            <div
              className="h-[60px] w-full max-w-[598.07px] rounded-lg border border-black/5 p-1 md:h-[97px] md:p-2"
              onMouseMove={handleMouseMove}
            >
              <div className="flex h-full gap-[1px] md:gap-0.5">
                {contributionGraph.weeks.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="flex flex-col gap-[1px] md:gap-0.5"
                  >
                    {week.days.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`size-[6px] rounded-full md:size-[9px] ${getSquareColor(day.level)} cursor-pointer transition-colors hover:opacity-80`}
                        onMouseEnter={(e) => handleMouseEnter(day, e)}
                        onMouseLeave={handleMouseLeave}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {tooltip && (
        <div
          ref={tooltipRef}
          className="fixed z-50 rounded-lg border border-black/5 bg-white px-3 py-2 text-sm text-black shadow-lg"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: "translateY(-100%)",
          }}
        >
          <div className="font-medium">{formatDate(tooltip.date)}</div>
          <div className="text-gray-300">
            {tooltip.count === 0
              ? "Aucune contribution Github"
              : `${tooltip.count} contribution${tooltip.count > 1 ? "s" : ""} Github`}
          </div>
        </div>
      )}
    </div>
  );
}
