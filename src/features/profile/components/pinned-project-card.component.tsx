import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa6";
import { RiGitForkFill } from "react-icons/ri";
import { VscIssues } from "react-icons/vsc";
import type { Project } from "@/features/projects/types/project.type";
import { Avatar } from "@/shared/components/ui/avatar";
import {
  ProjectCard,
  ProjectCardContent,
  ProjectCardDescription,
  ProjectCardHeader,
  ProjectCardInfo,
  ProjectCardLeftGroup,
  ProjectCardTitle,
} from "@/shared/components/ui/project-card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatNumberShort } from "@/shared/lib/utils/format-number";

interface PinnedProjectCardProps {
  project: Project;
  repositoryDetails?: {
    stars: number;
    forksCount: number;
    openIssuesCount: number;
  };
  isRepositoryLoading?: boolean;
}

export default function PinnedProjectCard({
  project,
  repositoryDetails = {
    stars: 0,
    forksCount: 0,
    openIssuesCount: 0,
  },
  isRepositoryLoading = false,
}: PinnedProjectCardProps) {
  const { id, title, description, logoUrl, imagesUrls = [] } = project;
  const displayImages = imagesUrls.slice(0, 4);

  return (
    <Link href={`/projects/${id}`} className="block">
      <ProjectCard className="w-full">
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
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-0.5">
                  <FaStar className="size-2.5 text-primary" />
                  {isRepositoryLoading ? (
                    <Skeleton className="h-4 w-8" />
                  ) : (
                    <span>{formatNumberShort(repositoryDetails.stars)}</span>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  <RiGitForkFill className="size-2.5" />
                  {isRepositoryLoading ? (
                    <Skeleton className="h-4 w-8" />
                  ) : (
                    <span>
                      {formatNumberShort(repositoryDetails.forksCount)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  <VscIssues className="size-2.5" />
                  {isRepositoryLoading ? (
                    <Skeleton className="h-4 w-8" />
                  ) : (
                    <span>
                      {formatNumberShort(repositoryDetails.openIssuesCount)}
                    </span>
                  )}
                </div>
              </div>
            </ProjectCardInfo>
          </ProjectCardLeftGroup>
        </ProjectCardHeader>
        <ProjectCardContent>
          <ProjectCardDescription className="mb-6 line-clamp-2!">
            {description}
          </ProjectCardDescription>
          {displayImages.length > 0 && (
            <div className="flex gap-2">
              {displayImages.map((imageUrl, index) => {
                const isDesktopOnly = index >= 2;
                const hasFourImages = displayImages.length === 4;
                const widthClass = hasFourImages
                  ? "flex-1"
                  : "w-28 md:w-36 flex-shrink-0";

                return (
                  <div
                    key={imageUrl}
                    className={`relative h-16 md:h-18 ${widthClass} overflow-hidden rounded-md ${
                      isDesktopOnly ? "hidden lg:block" : ""
                    }`}
                  >
                    <Image
                      src={imageUrl}
                      alt={`${title} screenshot ${index + 1}`}
                      fill
                      className="rounded-md border border-muted-black-stroke object-cover"
                      unoptimized
                    />
                  </div>
                );
              })}
            </div>
          )}
        </ProjectCardContent>
      </ProjectCard>
    </Link>
  );
}
