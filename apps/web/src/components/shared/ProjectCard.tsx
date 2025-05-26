import { getRoleBadgeVariant } from "@/lib/utils/badges";

import { useVisibleRoles } from "@/hooks/useVisibleRoles";

import StackIcon from "@/components/shared/StackIcon";
import { Badge } from "@/components/ui/badge";
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
  ProjectCardStars,
  ProjectCardTitle,
  ProjectCardViewLink,
  Role,
  TechIcon,
} from "@/components/ui/project-card";

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
}

export default function ProjectCardComponent({
  projectId = "1",
  title = "LeetGrind",
  description = "Un bot Discord pour pratiquer LeetCode chaque jour et progresser en algorithme dans une ambiance motivante",
  techStack = [],
  showTechStack = true,
  stars = 0,
  showStars = true,
  roles = [],
  roleCount = 0,
  showRoles = true,
  showViewProject = true,
  className = "",
  image,
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
            {showTechStack && techStack.length > 0 && (
              <div className="mt-1 flex gap-1">
                {techStack.map((tech, index) => {
                  if (!tech.icon) return null;
                  return (
                    <StackIcon key={index} icon={tech.icon} alt={tech.alt} />
                  );
                })}
              </div>
            )}
          </ProjectCardInfo>
        </ProjectCardLeftGroup>
        {showStars && <ProjectCardStars count={stars} />}
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

            {showViewProject && (
              <ProjectCardViewLink projectId={projectId} linkRef={actionRef} />
            )}
          </ProjectCardFooter>
        )}
      </ProjectCardContent>
    </ProjectCard>
  );
}
