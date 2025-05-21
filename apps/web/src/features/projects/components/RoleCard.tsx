import { Badge } from "@/components/ui/badge";
import { getRoleBadgeVariant } from "@/lib/utils/badges";
import React, { useState } from "react";

interface Badge {
  label: string;
  color: string;
  bgColor: string;
}

interface RoleCardProps {
  title: string;
  description: string;
  badges: Badge[];
  experienceBadge?: string;
}

const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  badges,
  experienceBadge,
}) => {
  const [applied, setApplied] = useState(false);

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    setApplied(true);
  };

  return (
    <div className="lg:max-w-[721.96px] w-full border border-[black]/10 rounded-[20px] p-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-[16px] font-medium">{title}</h3>
          {experienceBadge && (
            <span className="text-[10px] text-[black]/50 border border-[black]/10 rounded-full px-2 py-0.5">
              {experienceBadge}
            </span>
          )}
        </div>
        <p className="text-[12px] text-[black]/50 leading-[20px]">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {badges.map((badge, index) => (
            <Badge key={index} variant={getRoleBadgeVariant(title)}>
              {badge.label}
            </Badge>
          ))}
        </div>
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
