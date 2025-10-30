import Link from "next/link";
import React from "react";
import { HiChevronRight } from "react-icons/hi2";

interface BadgeProps {
  className?: string;
}

const HeroBadge: React.FC<BadgeProps> = ({ className = "" }) => {
  return (
    <Link href="https://discord.gg/u4y6y5KC" target="_blank">
      <div
        className={`hover:bg-accent inline-flex items-center justify-between rounded-full border border-black/5 bg-white py-1 pr-2 pl-1 tracking-tight transition-colors ${className}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-ost-blue-three bg-ost-blue-one/10 ml-0.5 rounded-full px-3 py-1 text-[10px] leading-tight font-medium md:text-xs">
            Update
          </span>
          <span className="text-muted-foreground text-[10px] leading-tight font-medium text-nowrap md:text-xs">
            Join a community of active contributers
          </span>
        </div>
        <HiChevronRight className="ml-1 opacity-60" size={14} />
      </div>
    </Link>
  );
};

export default HeroBadge;
