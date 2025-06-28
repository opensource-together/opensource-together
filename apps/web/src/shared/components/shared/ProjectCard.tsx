import { Badge } from "@/shared/components/ui/badge";
import {
  ProjectCard,
  ProjectCardContent,
  ProjectCardDescription,
  ProjectCardDivider,
  ProjectCardFooter,
  ProjectCardHeader,
  ProjectCardImage,
  ProjectCardInfo,
  ProjectCardLeftGroup,
  ProjectCardRolesCount,
  ProjectCardTitle,
  ProjectCardViewLink,
  Role,
  TechIcon,
} from "@/shared/components/ui/project-card";
import { useVisibleRoles } from "@/shared/hooks/use-visible-roles";
import { getRoleBadgeVariant } from "@/shared/lib/utils/badges";

import { Icon } from "../ui/icon";

interface ProjectCardProps {
  projectId?: string;
  title?: string;
  description?: string;
  techStack?: TechIcon[];
  showTechStack?: boolean;
  stars?: number;
  showStars?: boolean;
  roles?: Role[];
  roleCount?: number;
  showRoles?: boolean;
  showViewProject?: boolean;
  className?: string;
  image?: string;
  authorName?: string;
  communityStats?: {
    forks?: number;
    contributors?: number;
    stars?: number;
  };
}

export default function ProjectCardComponent({
  projectId = "1",
  title = "LeetGrind",
  description = "Un bot Discord pour pratiquer LeetCode chaque jour et progresser en algorithme dans une ambiance motivante",
  roles = [],
  roleCount = 0,
  showRoles = true,
  showViewProject = true,
  className = "",
  image,
  authorName,
  communityStats,
}: ProjectCardProps) {
  // Utilisation du hook personnalisé
  const {
    containerRef,
    counterRef,
    actionRef,
    visibleRoles,
    remainingRoles,
    measured,
  } = useVisibleRoles({
    roles,
    dependencies: [showViewProject, title, description],
  });

  return (
    <ProjectCard className={className}>
      <ProjectCardHeader>
        <ProjectCardLeftGroup>
          {image && <ProjectCardImage src={image} alt={`${title} icon`} />}
          <ProjectCardInfo>
            <ProjectCardTitle>{title}</ProjectCardTitle>
            <p className="text-muted-foreground text-sm tracking-tighter">
              by {authorName}
            </p>
          </ProjectCardInfo>
        </ProjectCardLeftGroup>
        {showViewProject && (
          <ProjectCardViewLink projectId={projectId} linkRef={actionRef} />
        )}
      </ProjectCardHeader>
      <ProjectCardContent>
        {description && (
          <ProjectCardDescription>{description}</ProjectCardDescription>
        )}
        <ProjectCardDivider />
        {showRoles && (
          <ProjectCardFooter ref={containerRef}>
            <ProjectCardRolesCount count={roleCount} counterRef={counterRef} />
            {measured && (
              <>
                {visibleRoles.map((role, index) => (
                  <Badge key={index} variant={getRoleBadgeVariant(role.name)}>
                    {role.name}
                  </Badge>
                ))}
                {remainingRoles > 0 && (
                  <span className="flex h-5.5 flex-shrink-0 items-center rounded-full bg-transparent px-1 text-xs font-semibold whitespace-nowrap text-[black]/20">
                    +{remainingRoles}
                  </span>
                )}
              </>
            )}
            <div className="ml-auto flex items-center justify-between space-x-2">
              <div className="flex items-center justify-center gap-1 text-xs">
                <Icon name="fork" size="xs" variant="black" />
                {communityStats?.forks || 0}
              </div>
              <div className="flex items-center justify-center gap-1 text-xs">
                <Icon name="people" size="xs" variant="black" />
                {communityStats?.contributors || 0}
              </div>
              <div className="flex items-center justify-center gap-1 text-xs">
                <Icon name="star" size="xs" variant="black" />
                {communityStats?.stars || 0}
              </div>
            </div>
          </ProjectCardFooter>
        )}
      </ProjectCardContent>
    </ProjectCard>
  );
}
