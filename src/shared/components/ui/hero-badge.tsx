import Image from "next/image";
import React from "react";

interface BadgeProps {
  className?: string;
}

const HeroBadge: React.FC<BadgeProps> = ({ className = "" }) => {
  return (
    <div
      className={`inline-flex items-center justify-between rounded-full border border-black/5 bg-white py-1 pr-2 pl-1 tracking-tight ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="ml-0.5 rounded-full bg-[#51A2FF1A] px-3 py-1 text-xs leading-tight font-medium text-[#2B7FFF]">
          Update
        </span>
        <span className="text-xs leading-tight font-normal text-nowrap text-black/60">
          Join a community of active contributers
        </span>
      </div>
      <Image
        src="/icons/chevron-right.svg"
        alt="Chevron Right"
        width={7}
        height={7}
        className="ml-2 opacity-60"
      />
    </div>
  );
};

export default HeroBadge;
