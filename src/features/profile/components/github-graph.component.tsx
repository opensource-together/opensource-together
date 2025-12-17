import { useRef, useState } from "react";

import type {
  ContributionGraph,
  ContributionLevel,
} from "../types/github-graph.type";

interface GithubGraphProps {
  contributionGraph?: ContributionGraph;
  contributionsCount?: number;
}

interface TooltipData {
  date: string;
  contributionCount: number;
  contributionLevel: ContributionLevel;
}

export default function GithubGraph({ contributionGraph }: GithubGraphProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const getSquareColor = (level: ContributionLevel): string => {
    switch (level) {
      case "NONE":
        return "bg-[#E8EAEE]";
      case "FIRST_QUARTILE":
        return "bg-ost-blue-one";
      case "SECOND_QUARTILE":
        return "bg-ost-blue-two";
      case "THIRD_QUARTILE":
        return "bg-ost-blue-three";
      case "FOURTH_QUARTILE":
        return "bg-ost-blue-four";
      default:
        return "bg-[#E8EAEE]";
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
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
      <div className="h-full w-full">
        <div>
          <h3 className="mb-2">Contribution Activity</h3>
          <div className="flex h-[87px] w-full items-center justify-center rounded-lg border border-black/5 p-2">
            <p className="text-gray-500 text-sm">
              No contribution data available
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
    <div className="h-full w-full">
      <div>
        <h2 className="mb-2">Contribution Activity</h2>

        <div className="w-full overflow-x-auto md:overflow-x-hidden">
          <div className="relative w-max md:origin-left md:scale-x-[0.99]">
            <div className="mb-0.5 flex pr-2.5">
              {months.map((month, index) => (
                <div key={index} className="flex-1 text-left">
                  <span className="text-[8px] text-neutral-400">{month}</span>
                </div>
              ))}
            </div>

            <div className="flex">
              <div
                className="h-[93px] w-max rounded-md border border-black/5 p-2"
                onMouseMove={handleMouseMove}
              >
                <div className="flex h-full gap-0.5">
                  {contributionGraph.weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-0.5">
                      {week.contributionDays.map((day, dayIndex) => (
                        <div
                          key={dayIndex}
                          className={`size-[9.5px] rounded-xs ${getSquareColor(day.contributionLevel)} cursor-pointer transition-colors hover:opacity-80`}
                          onMouseEnter={(e) => handleMouseEnter(day, e)}
                          onMouseLeave={handleMouseLeave}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="ml-2 flex flex-col justify-between py-1">
                {days.map((day, index) => (
                  <span
                    key={index}
                    className="text-[8px] text-[var(--neutral-400)]"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <span className="text-[10px] text-[var(--neutral-400)]">Less</span>
          <div className="flex gap-0.5">
            <div className="size-[9px] rounded-xs bg-[#E8EAEE]" />
            <div className="size-[9px] rounded-xs bg-[var(--ost-blue-one)]" />
            <div className="size-[9px] rounded-xs bg-[var(--ost-blue-two)]" />
            <div className="size-[9px] rounded-xs bg-[var(--ost-blue-three)]" />
            <div className="size-[9px] rounded-xs bg-[var(--ost-blue-four)]" />
          </div>
          <span className="text-[10px] text-[var(--neutral-400)]">More</span>
        </div>
      </div>

      {tooltip && (
        <div
          ref={tooltipRef}
          className="fixed z-50 rounded-lg border border-black/5 bg-white px-3 py-2 text-black text-sm shadow-lg"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: "translateY(-100%)",
          }}
        >
          <div className="font-medium">{formatDate(tooltip.date)}</div>
          <div className="text-gray-300">
            {tooltip.contributionCount === 0
              ? "No contribution data available"
              : `${tooltip.contributionCount} Github contribution${tooltip.contributionCount > 1 ? "s" : ""}`}
          </div>
        </div>
      )}
    </div>
  );
}
