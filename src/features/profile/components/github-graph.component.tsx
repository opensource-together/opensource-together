import { useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib/utils";

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

const MD_BREAKPOINT_QUERY = "(max-width: 767px)";
const MOBILE_CELL_PX = 10;
const MOBILE_GRID_GAP_PX = 2;

export default function GithubGraph({ contributionGraph }: GithubGraphProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isMobileLayout, setIsMobileLayout] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MD_BREAKPOINT_QUERY);
    const apply = () => setIsMobileLayout(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

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

  const weekCount = contributionGraph.weeks.length;
  const rowCount = Math.max(
    7,
    ...contributionGraph.weeks.map((w) => w.contributionDays.length)
  );

  return (
    <div className="h-full w-full">
      <div>
        <h2 className="mb-2">Contribution Activity</h2>

        <div
          className={cn(
            "w-full rounded-md border border-black/5 p-2",
            isMobileLayout &&
              "touch-pan-x overflow-x-auto overflow-y-hidden overscroll-x-contain"
          )}
          onMouseMove={handleMouseMove}
        >
          <div
            className={cn(
              "grid min-w-0",
              isMobileLayout ? "w-max" : "w-full gap-0.5"
            )}
            style={
              isMobileLayout
                ? {
                    gridTemplateColumns: `repeat(${weekCount}, ${MOBILE_CELL_PX}px)`,
                    gridTemplateRows: `repeat(${rowCount}, ${MOBILE_CELL_PX}px)`,
                    gap: `${MOBILE_GRID_GAP_PX}px`,
                  }
                : {
                    aspectRatio: `${weekCount} / ${rowCount}`,
                    gridTemplateColumns: `repeat(${weekCount}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))`,
                  }
            }
          >
            {contributionGraph.weeks.map((week, weekIndex) =>
              week.contributionDays.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  style={{
                    gridColumn: weekIndex + 1,
                    gridRow: dayIndex + 1,
                  }}
                  className={`min-h-0 min-w-0 rounded-xs ${getSquareColor(day.contributionLevel)} cursor-pointer transition-colors hover:opacity-80`}
                  onMouseEnter={(e) => handleMouseEnter(day, e)}
                  onMouseLeave={handleMouseLeave}
                />
              ))
            )}
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <span className="text-[10px] text-neutral-500">Less</span>
          <div className="flex gap-0.5">
            <div className="size-[9px] rounded-xs bg-[#E8EAEE]" />
            <div className="size-[9px] rounded-xs bg-[var(--ost-blue-one)]" />
            <div className="size-[9px] rounded-xs bg-[var(--ost-blue-two)]" />
            <div className="size-[9px] rounded-xs bg-[var(--ost-blue-three)]" />
            <div className="size-[9px] rounded-xs bg-[var(--ost-blue-four)]" />
          </div>
          <span className="text-[10px] text-neutral-500">More</span>
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
          <div className="text-neutral-500">
            {tooltip.contributionCount === 0
              ? "No contribution data available"
              : `${tooltip.contributionCount} Github contribution${tooltip.contributionCount > 1 ? "s" : ""}`}
          </div>
        </div>
      )}
    </div>
  );
}
