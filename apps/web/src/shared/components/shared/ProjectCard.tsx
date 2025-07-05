import {
  ProjectCard,
  ProjectCardContent,
  ProjectCardDescription,
  ProjectCardDivider,
  ProjectCardFooter,
  ProjectCardHeader,
  ProjectCardInfo,
  ProjectCardLeftGroup,
  ProjectCardTitle,
  ProjectCardViewLink,
  Role,
  TechIcon,
} from "@/shared/components/ui/project-card";

import StackLogo from "../logos/stack-logo";
import { Avatar } from "../ui/avatar";
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
  title = "",
  description = "",
  techStack = [],
  showTechStack = true,
  showViewProject = true,
  className = "",
  image = "",
  authorName = "",
  communityStats = {
    forks: 0,
    contributors: 0,
    stars: 0,
  },
}: ProjectCardProps) {
  return (
    <ProjectCard className={className}>
      <ProjectCardHeader>
        <ProjectCardLeftGroup>
          <Avatar src={image} name={authorName} alt={authorName} size="lg" />
          <ProjectCardInfo>
            <ProjectCardTitle>{title}</ProjectCardTitle>
            <p className="text-muted-foreground text-sm tracking-tighter">
              by {authorName}
            </p>
          </ProjectCardInfo>
        </ProjectCardLeftGroup>
        {showViewProject && <ProjectCardViewLink projectId={projectId} />}
      </ProjectCardHeader>
      <ProjectCardContent>
        <ProjectCardDescription>{description}</ProjectCardDescription>
        <ProjectCardDivider />
        {showTechStack && (
          <ProjectCardFooter>
            <>
              {techStack.slice(0, 3).map((tech, index) => (
                <StackLogo
                  key={index}
                  icon={tech.icon}
                  alt={tech.alt}
                  name={tech.alt}
                />
              ))}
              {techStack.length > 3 && (
                <span className="flex h-5.5 flex-shrink-0 items-center rounded-full bg-transparent text-xs whitespace-nowrap text-black/20">
                  +{techStack.length - 3}
                </span>
              )}
            </>
            <div className="ml-auto flex items-center justify-between space-x-2">
              <div className="flex items-center justify-center gap-1 text-xs">
                <Icon name="fork" size="xs" variant="black" />
                {communityStats.forks}
              </div>
              <div className="flex items-center justify-center gap-1 text-xs">
                <Icon name="people" size="xs" variant="black" />
                {communityStats.contributors}
              </div>
              <div className="flex items-center justify-center gap-1 text-xs">
                <Icon name="star" size="xs" variant="black" />
                {communityStats.stars}
              </div>
            </div>
          </ProjectCardFooter>
        )}
      </ProjectCardContent>
    </ProjectCard>
  );
}
