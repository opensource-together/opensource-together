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
        <ProjectCardFooter className="mt-4 flex flex-wrap gap-2">
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
    <div className="mb-6 flex min-h-[174px] w-[717px] animate-pulse flex-col rounded-[16px] border border-black/10 bg-white px-8 py-6 shadow-[0_2px_5px_rgba(0,0,0,0.02)]">
      <div className="mb-2 flex items-start justify-between">
        <div className="h-5 w-40 rounded bg-gray-200" />
        <div className="h-[20px] w-[118px] rounded-full bg-gray-100" />
      </div>
      <div className="mb-4 h-4 w-3/4 rounded bg-gray-100" />
      <div className="my-3 w-full border-t border-dashed border-black/10"></div>
      <div className="mt-auto flex items-end justify-between">
        <div className="flex gap-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-[24px] w-[60px] rounded bg-gray-100" />
          ))}
        </div>
        <div className="ml-auto h-8 w-32 rounded bg-gray-200" />
      </div>
    </div>
  );
}
