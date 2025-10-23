import React from "react";
import { HiChevronRight } from "react-icons/hi2";

interface BadgeProps {
  className?: string;
}

const HeroBadge: React.FC<BadgeProps> = ({ className = "" }) => {
  return (
    <div
      className={`hover:bg-accent inline-flex items-center justify-between rounded-full border border-black/5 bg-white py-1 pr-2 pl-1 tracking-tight transition-colors ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-ost-blue-three bg-ost-blue-one/10 ml-0.5 rounded-full px-3 py-1 text-xs leading-tight font-medium">
          Update
        </span>
        <span className="text-muted-foreground text-xs leading-tight font-medium text-nowrap">
          Join a community of active contributers
        </span>
      </div>
      <HiChevronRight className="ml-1 opacity-60" size={14} />
    </div>
  );
};

export default HeroBadge;
