import arrowupright from "@/shared/icons/arrow-up-right.svg";
import validationIcon from "@/shared/icons/validation-icon.svg";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Badge } from "../types/projectTypes";

interface RoleCardProps {
  title: string;
  description: string;
  badges?: Badge[];
  buttonLabel?: string;
  buttonHref?: string;
  experienceBadge?: string;
}

const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  badges = [],
  buttonLabel = "Postuler pour le rôle",
  buttonHref = "#",
  experienceBadge,
}) => {
  const [applied, setApplied] = useState(false);

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    setApplied(true);
  };

  return (
    <div className="w-[717px] min-h-[174px] bg-white rounded-[16px] border border-black/10 shadow-[0_2px_5px_rgba(0,0,0,0.02)] px-8 py-6 flex flex-col mb-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-geist font-medium text-[18px] text-black">
          {title}
        </h3>
        {experienceBadge && (
          <div className="flex items-center h-[20px] bg-black/[0.02] rounded-full px-3">
            <span className="font-geist font-normal text-[11px] tracking-[-0.5px] text-black/40">
              {experienceBadge}
            </span>
          </div>
        )}
      </div>
      <p className="font-geist font-normal text-[12px] leading-[20px] text-black/70 mb-4">
        {description}
      </p>
      <div className="border-t-[0.5px] border-dashed border-black/10 w-full"></div>
      <div className="flex items-end justify-between mt-auto">
        <div className="flex gap-2">
          {badges.length > 0 &&
            badges.map((badge, idx) => (
              <span
                key={idx}
                className="px-3 h-[18px] w-auto flex justify-center items-center py-[2px] rounded-full text-[11px] font-geist font-medium"
                style={{ color: badge.color, backgroundColor: badge.bgColor }}
              >
                {badge.label}
              </span>
            ))}
        </div>
        <Link
          href={buttonHref}
          onClick={handleApply}
          className="text-[14px] font-semibold ml-auto flex font-geist items-center gap-1 hover:opacity-80 transition-opacity"
        >
          {applied ? "Applied to role" : buttonLabel}
          <Image
            src={applied ? validationIcon : arrowupright}
            alt={applied ? "applied" : "arrowupright"}
            width={10}
            height={10}
          />
        </Link>
      </div>
    </div>
  );
};

export default RoleCard;

export function SkeletonRoleCard() {
  return (
    <div className="w-[717px] min-h-[174px] bg-white rounded-[16px] border border-black/10 shadow-[0_2px_5px_rgba(0,0,0,0.02)] px-8 py-6 flex flex-col mb-6 animate-pulse">
      <div className="flex justify-between items-start mb-2">
        <div className="h-5 w-40 bg-gray-200 rounded" />
        <div className="h-[20px] w-[118px] bg-gray-100 rounded-full" />
      </div>
      <div className="h-4 w-3/4 bg-gray-100 rounded mb-4" />
      <div className="border-t border-dashed border-black/10 w-full my-3"></div>
      <div className="flex items-end justify-between mt-auto">
        <div className="flex gap-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="w-[60px] h-[24px] bg-gray-100 rounded" />
          ))}
        </div>
        <div className="h-8 w-32 bg-gray-200 rounded ml-auto" />
      </div>
    </div>
  );
}
