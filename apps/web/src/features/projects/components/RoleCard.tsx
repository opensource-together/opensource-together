"use client";

import { cn } from "@/lib/utils";
import { getTechBadgeVariant } from "@/lib/utils/badges";

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
import { Skeleton } from "@/components/ui/skeleton";

import { ProjectRole } from "../types/projectTypes";

interface RoleCardProps {
  role: ProjectRole;
  className?: string;
}

export default function RoleCard({ role, className }: RoleCardProps) {
  const { title = "", description = "", badges = [] } = role;

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
        {badges.length > 0 && (
          <ProjectCardFooter className="mt-4 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Badge
                key={`${badge.label}-${badge.color}`}
                variant={getTechBadgeVariant(badge.label)}
                className={cn(badge.color, badge.bgColor)}
              >
                {badge.label}
              </Badge>
            ))}
          </ProjectCardFooter>
        )}
      </ProjectCardContent>
    </ProjectCard>
  );
}

export function SkeletonRoleCard() {
  return (
    <div className="mb-6 flex min-h-[174px] w-[717px] flex-col rounded-[16px] border border-black/10 bg-white px-8 py-6 shadow-[0_2px_5px_rgba(0,0,0,0.02)]">
      <div className="mb-2 flex items-start justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-[20px] w-[118px] rounded-full" />
      </div>
      <Skeleton className="mb-4 h-4 w-3/4" />
      <div className="my-3 w-full border-t border-dashed border-black/10" />
      <div className="mt-auto flex items-end justify-between">
        <div className="flex gap-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-[24px] w-[60px]" />
          ))}
        </div>
        <Skeleton className="ml-auto h-8 w-32" />
      </div>
    </div>
  );
}
