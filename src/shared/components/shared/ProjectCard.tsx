import Link from "next/link";
import { useMemo } from "react";
import { FaStar } from "react-icons/fa6";
import { VscIssues } from "react-icons/vsc";

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
import { languagesToTechStacks } from "@/shared/lib/language-icons";
import { extractRepositoryOwner } from "@/shared/lib/utils/extract-repo-owner";
import { formatNumberShort } from "@/shared/lib/utils/format-number";
import { TechStackType } from "@/shared/types/tech-stack.type";

import { RepositoryWithDetails } from "@/features/projects/types/project.type";

import { Avatar } from "../ui/avatar";
import { Icon } from "../ui/icon";
import { Skeleton } from "../ui/skeleton";
import StackLogo from "../ui/stack-logo";

interface ProjectCardProps {
  projectId?: string;
  title: string;
  description: string;
  projectTechStacks?: TechStackType[];
  showTechStack?: boolean;
  repoUrl?: string;
  className?: string;
  logoUrl?: string;
  repositoryDetails?: Pick<
    RepositoryWithDetails,
    "stars" | "forksCount" | "openIssuesCount" | "languages"
  >;
  isRepositoryLoading?: boolean;
}

export default function ProjectCardComponent({
  projectId,
  title = "",
  description = "",
  repoUrl = "",
  projectTechStacks = [],
  showTechStack = true,
  className = "",
  logoUrl = "",

  repositoryDetails = {
    forksCount: 0,
    stars: 0,
    openIssuesCount: 0,
    languages: {},
  },
  isRepositoryLoading = false,
}: ProjectCardProps) {
  const languagesTechStacks = useMemo(() => {
    return languagesToTechStacks(repositoryDetails.languages);
  }, [repositoryDetails.languages]);

  const allTechStacks = useMemo(() => {
    if (projectTechStacks.length > 0) {
      return projectTechStacks;
    }
    return languagesTechStacks;
  }, [projectTechStacks, languagesTechStacks]);

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
                by {extractRepositoryOwner(repoUrl)}
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
                  {allTechStacks.length > 0
                    ? allTechStacks
                        .slice(0, 3)
                        .map((tech, index) => (
                          <StackLogo
                            key={tech.id || index}
                            icon={tech.iconUrl || ""}
                            alt={tech.name}
                            name={tech.name}
                          />
                        ))
                    : isRepositoryLoading
                      ? Array.from({ length: 3 }).map((_, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <Skeleton className="size-5.5 rounded-full" />
                            <Skeleton className="h-5.5 w-16 rounded-md" />
                          </div>
                        ))
                      : null}
                </div>
                {allTechStacks.length > 3 && (
                  <span className="ml-3 flex h-5.5 flex-shrink-0 items-center rounded-full bg-transparent text-xs whitespace-nowrap text-black/20">
                    +{allTechStacks.length - 3}
                  </span>
                )}
              </>
              <div className="ml-auto flex items-center justify-between space-x-2">
                <div className="flex items-center justify-center text-xs">
                  <Icon name="fork" size="xxs" className="mr-0.5" />
                  {isRepositoryLoading ? (
                    <Skeleton className="h-3 w-6" />
                  ) : (
                    formatNumberShort(repositoryDetails.forksCount || 0)
                  )}
                </div>
                <div className="flex items-center justify-center gap-0 text-xs">
                  <VscIssues className="mr-0.5 size-3 text-black" />
                  {isRepositoryLoading ? (
                    <Skeleton className="h-3 w-6" />
                  ) : (
                    formatNumberShort(repositoryDetails.openIssuesCount || 0)
                  )}
                </div>
                <div className="flex items-center justify-center gap-0 text-xs">
                  <FaStar className="text-primary mr-0.5 size-2.5" />
                  {isRepositoryLoading ? (
                    <Skeleton className="h-3 w-6" />
                  ) : (
                    formatNumberShort(repositoryDetails.stars || 0)
                  )}
                </div>
              </div>
            </ProjectCardFooter>
          )}
        </ProjectCardContent>
      </ProjectCard>
    </Link>
  );
}
