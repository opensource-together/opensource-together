import Link from "next/link";
import type React from "react";
import { HiChevronRight } from "react-icons/hi2";
import { EXTERNAL_LINKS } from "@/shared/lib/constants";

interface BadgeProps {
  className?: string;
  pillLabel?: string;
  description?: string;
  href?: string;
}

const HeroBadge: React.FC<BadgeProps> = ({
  className = "",
  pillLabel = "Discord",
  description = "Join a community of active contributers",
  href = EXTERNAL_LINKS.DISCORD,
}) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group"
    >
      <div
        className={`inline-flex items-center rounded-full border border-black/5 bg-white py-1 pr-2 pl-1 tracking-tight transition-all duration-300 ${className}`}
      >
        <div className="flex items-center gap-2">
          <span className="ml-0.5 rounded-full bg-ost-blue-one/10 px-3 py-1 font-medium text-[10px] text-ost-blue-three leading-tight md:text-xs">
            {pillLabel}
          </span>
          <span className="text-nowrap font-medium text-[12px] text-muted-foreground leading-tight tracking-normal md:text-xs">
            {description}
          </span>
          <span className="flex w-0 items-center overflow-hidden transition-[width] duration-300 ease-in-out group-hover:w-[14px]">
            <HiChevronRight className="shrink-0 opacity-60" size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default HeroBadge;
