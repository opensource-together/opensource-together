import Link from "next/link";
import { FaStar } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi2";

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
} from "@/shared/components/ui/project-card";
import { TechStackType } from "@/shared/types/tech-stack.type";

import { Owner, ProjectStats } from "@/features/projects/types/project.type";

import { Avatar } from "../ui/avatar";
import { Icon } from "../ui/icon";
import StackLogo from "../ui/stack-logo";

interface ProjectCardProps {
  projectId?: string;
  title?: string;
  description?: string;
  projectTechStacks?: TechStackType[];
  showTechStack?: boolean;
  className?: string;
  logoUrl?: string;
  owner?: Owner;
  projectStats?: ProjectStats;
}

export default function ProjectCardComponent({
  projectId = "1",
  title = "",
  description = "",
  projectTechStacks = [],
  showTechStack = true,
  className = "",
  logoUrl = "",
  owner = {
    id: "",
    name: "",
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
            <Avatar
              src={logoUrl}
              name={title}
              alt={title}
              size="lg"
              shape="soft"
            />
            <ProjectCardInfo>
              <ProjectCardTitle className="text-primary">
                {title}
              </ProjectCardTitle>
              <p className="text-muted-foreground -mt-1 text-sm tracking-tighter">
                by {owner.name}
              </p>
            </ProjectCardInfo>
          </ProjectCardLeftGroup>
        </ProjectCardHeader>
        <ProjectCardContent>
          <ProjectCardDescription>{description}</ProjectCardDescription>
          <ProjectCardDivider />
          {showTechStack && (
            <ProjectCardFooter>
              <>
                <div className="flex gap-2.5">
                  {projectTechStacks.slice(0, 3).map((tech, index) => (
                    <StackLogo
                      key={tech.id || index}
                      icon={tech.iconUrl || ""}
                      alt={tech.name}
                      name={tech.name}
                    />
                  ))}
                </div>
                {projectTechStacks.length > 3 && (
                  <span className="ml-3 flex h-5.5 flex-shrink-0 items-center rounded-full bg-transparent text-xs whitespace-nowrap text-black/20">
                    +{projectTechStacks.length - 3}
                  </span>
                )}
              </>
              <div className="ml-auto flex items-center justify-between space-x-2">
                <div className="flex items-center justify-center text-[10px]">
                  <Icon name="fork" size="xxs" className="mr-0.5" />
                  {projectStats.forks || 0}
                </div>
                <div className="flex items-center justify-center gap-0 text-[10px]">
                  <HiUserGroup className="mr-0.5 size-3 text-black" />
                  {projectStats.contributors?.length || 0}
                </div>
                <div className="flex items-center justify-center gap-0 text-[10px]">
                  <FaStar className="text-primary mr-0.5 size-2.5" />
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
