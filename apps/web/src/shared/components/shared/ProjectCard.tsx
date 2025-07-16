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
} from "@/shared/components/ui/project-card";

import { ProjectRole } from "@/features/projects/types/project-role.type";
import {
  Author,
  ProjectStats,
  TechStack,
} from "@/features/projects/types/project.type";

import StackLogo from "../logos/stack-logo";
import { Avatar } from "../ui/avatar";
import { Icon } from "../ui/icon";

interface ProjectCardProps {
  projectId?: string;
  title?: string;
  shortDescription?: string;
  techStacks?: TechStack[];
  showTechStack?: boolean;
  roles?: ProjectRole[];
  showViewProject?: boolean;
  className?: string;
  image?: string;
  author?: Author;
  projectStats?: ProjectStats;
}

export default function ProjectCardComponent({
  projectId = "1",
  title = "",
  shortDescription = "",
  techStacks = [],
  showTechStack = true,
  showViewProject = true,
  className = "",
  image = "",
  author = {
    ownerId: "",
    name: "",
    avatarUrl: "",
  },
  projectStats = {
    forks: 0,
    contributors: [],
    stars: 0,
    watchers: 0,
    openIssues: 0,
    commits: 0,
    lastCommit: {
      sha: "",
      message: "",
      date: "",
      url: "",
      author: { login: "", avatar_url: "", html_url: "" },
    },
  },
}: ProjectCardProps) {
  return (
    <ProjectCard className={className}>
      <ProjectCardHeader>
        <ProjectCardLeftGroup>
          <Avatar src={image} name={author.name} alt={author.name} size="lg" />
          <ProjectCardInfo>
            <ProjectCardTitle>{title}</ProjectCardTitle>
            <p className="text-muted-foreground text-sm tracking-tighter">
              by {author.name}
            </p>
          </ProjectCardInfo>
        </ProjectCardLeftGroup>
        {showViewProject && <ProjectCardViewLink projectId={projectId} />}
      </ProjectCardHeader>
      <ProjectCardContent>
        <ProjectCardDescription>{shortDescription}</ProjectCardDescription>
        <ProjectCardDivider />
        {showTechStack && (
          <ProjectCardFooter>
            <>
              {techStacks.slice(0, 3).map((tech, index) => (
                <StackLogo
                  key={tech.id || index}
                  icon={tech.iconUrl || ""}
                  alt={tech.name}
                  name={tech.name}
                />
              ))}
              {techStacks.length > 3 && (
                <span className="flex h-5.5 flex-shrink-0 items-center rounded-full bg-transparent text-xs whitespace-nowrap text-black/20">
                  +{techStacks.length - 3}
                </span>
              )}
            </>
            <div className="ml-auto flex items-center justify-between space-x-2">
              <div className="flex items-center justify-center gap-1 text-xs">
                <Icon name="fork" size="xs" variant="black" />
                {projectStats.forks || 0}
              </div>
              <div className="flex items-center justify-center gap-1 text-xs">
                <Icon name="people" size="xs" variant="black" />
                {projectStats.contributors?.length || 0}
              </div>
              <div className="flex items-center justify-center gap-1 text-xs">
                <Icon name="star" size="xs" variant="black" />
                {projectStats.stars || 0}
              </div>
            </div>
          </ProjectCardFooter>
        )}
      </ProjectCardContent>
    </ProjectCard>
  );
}
