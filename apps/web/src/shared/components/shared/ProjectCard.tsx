import Link from "next/link";

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
  ProjectCardViewText,
} from "@/shared/components/ui/project-card";

import { ProjectRole } from "@/features/projects/types/project-role.type";
import {
  Owner,
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
  owner?: Owner;
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
  owner = {
    id: "",
    username: "",
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
    <Link href={`/projects/${projectId}`} className="block">
      <ProjectCard className={className}>
        <ProjectCardHeader>
          <ProjectCardLeftGroup>
            <Avatar src={image} name={title} alt={title} size="lg" />
            <ProjectCardInfo>
              <ProjectCardTitle className="text-primary">
                {title}
              </ProjectCardTitle>
              <p className="text-muted-foreground -mt-1 text-xs tracking-tighter">
                by {owner.username}
              </p>
            </ProjectCardInfo>
          </ProjectCardLeftGroup>
          {showViewProject && <ProjectCardViewText />}
        </ProjectCardHeader>
        <ProjectCardContent>
          <ProjectCardDescription>{shortDescription}</ProjectCardDescription>
          <ProjectCardDivider />
          {showTechStack && (
            <ProjectCardFooter>
              <>
                <div className="flex gap-5">
                  {techStacks.slice(0, 3).map((tech, index) => (
                    <StackLogo
                      key={tech.id || index}
                      icon={tech.iconUrl || ""}
                      alt={tech.name}
                      name={tech.name}
                    />
                  ))}
                </div>
                {techStacks.length > 3 && (
                  <span className="flex h-5.5 flex-shrink-0 items-center rounded-full bg-transparent text-xs whitespace-nowrap text-black/20">
                    +{techStacks.length - 3}
                  </span>
                )}
              </>
              <div className="ml-auto flex items-center justify-between space-x-2">
                <div className="flex items-center justify-center text-[10px]">
                  <Icon name="fork" size="xxs" className="mr-0.5" />
                  {projectStats.forks || 0}
                </div>
                <div className="flex items-center justify-center gap-0 text-[10px]">
                  <Icon
                    name="people"
                    size="xs"
                    variant="default"
                    className="mr-0.5"
                  />
                  {projectStats.contributors?.length || 0}
                </div>
                <div className="flex items-center justify-center gap-0 text-[10px]">
                  <Icon
                    name="star"
                    size="xs"
                    variant="black"
                    className="mr-0.5"
                  />
                  {projectStats.stars || 0}
                </div>
              </div>
            </ProjectCardFooter>
          )}
        </ProjectCardContent>
      </ProjectCard>
    </Link>
  );
}
