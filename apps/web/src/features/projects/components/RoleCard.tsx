"use client";
import { Badge } from "@/components/ui/badge";
import {
  ProjectCard,
  ProjectCardContent,
  ProjectCardDescription,
  ProjectCardFooter,
  ProjectCardHeader,
  ProjectCardInfo,
  ProjectCardLeftGroup,
  ProjectCardTitle,
} from "@/components/ui/project-card";
import { cn } from "@/lib/utils";
import { getTechBadgeVariant } from "@/lib/utils/badges";

interface Badge {
  label: string;
  color: string;
  bgColor: string;
}

interface RoleCardProps {
  title?: string;
  description?: string;
  badges: Badge[];
  className?: string;
}

export default function RoleCard({
  title = "LeetGrind",
  description = "Un bot Discord pour pratiquer LeetCode chaque jour et progresser en algorithme dans une ambiance motivante",
  badges = [],
  className = "",
}: RoleCardProps) {
  return (
    <ProjectCard className={className}>
      <ProjectCardHeader>
        <ProjectCardLeftGroup>
          <ProjectCardInfo>
            <ProjectCardTitle className="text-[16px] font-medium">
              {title}
            </ProjectCardTitle>
          </ProjectCardInfo>
        </ProjectCardLeftGroup>
      </ProjectCardHeader>

      <ProjectCardContent className="-mt-2">
        {description && (
          <ProjectCardDescription>{description}</ProjectCardDescription>
        )}
        <ProjectCardFooter className="flex flex-wrap gap-2 mt-4">
          {badges.map((badge, index) => (
            <Badge
              key={index}
              variant={getTechBadgeVariant(badge.label)}
              className={cn(badge.color, badge.bgColor)}
            >
              {badge.label}
            </Badge>
          ))}
        </ProjectCardFooter>
      </ProjectCardContent>
    </ProjectCard>
  );
}

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
