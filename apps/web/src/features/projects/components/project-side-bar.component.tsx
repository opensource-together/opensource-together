import Image from "next/image";

import StackLogo from "@/shared/components/logos/stack-logo";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { Project } from "../types/project.type";

interface ProjectSideBarProps {
  project: Project;
}

/**
 * Displays a sidebar with project details, including image, title, community statistics, tech stack, and main contributors.
 *
 * Renders action buttons for joining the project and, if available, viewing the GitHub repository. Shows up to three contributor avatars and a list of technology stack logos.
 *
 * @param project - The project data to display in the sidebar
 */
export default function ProjectSideBar({ project }: ProjectSideBarProps) {
  const {
    title = "",
    image = "/icons/empty-project.svg",
    techStacks = [],
    socialLinks = [],
    communityStats: { stars = 0, contributors = 0, forks = 0 } = {},
  } = project;

  // Récupérer le lien GitHub
  const githubLink = socialLinks.find((link) => link.type === "github")?.url;

  return (
    <div className="flex flex-col gap-5 bg-white">
      {/* Project Icon */}
      <div className="flex h-[252px] w-[252px] items-center justify-center self-center rounded-4xl bg-[#F4F4F4]">
        <Image
          src={image}
          alt={title}
          width={252}
          height={252}
          className="rounded-4xl"
        />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-start gap-2 px-2 text-sm text-black/70">
        {/* Project Title */}
        <h1
          className="text-start text-3xl font-medium text-black"
          style={{ letterSpacing: "-2px" }}
        >
          {title}
        </h1>
        <div className="flex items-center gap-1">
          <Image
            src="/icons/branch-git-fork.svg"
            alt="forks"
            width={11}
            height={11}
          />
          <span className="text-xs text-black">{forks}</span>
        </div>
        <div className="flex items-center gap-1">
          <Image
            src="/icons/people-filled-in-black.svg"
            alt="contributors"
            width={12}
            height={11}
          />
          <span className="text-xs text-black">{contributors}</span>
        </div>
        <div className="mt-[1px] flex items-center gap-1">
          <Image
            src="/icons/star-filled-in-black.svg"
            alt="stars"
            width={11}
            height={11}
            className="mb-[2px]"
          />
          <span className="text-xs text-black">{stars}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button className="flex flex-1 items-center justify-center gap-0">
          Rejoindre le projet
          <Image
            src="/icons/chevron-right.svg"
            alt="chevron right"
            width={7}
            height={8}
            className="ml-2"
            style={{ filter: "invert(1)", marginTop: "1px" }}
          />
        </Button>
        {githubLink && (
          <Button variant="outline" className="flex-1" asChild>
            <a href={githubLink} target="_blank" rel="noopener noreferrer">
              Voir le Repo
              <Image
                src="/icons/github.svg"
                alt="github"
                width={16}
                height={16}
              />
            </a>
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-xs font-normal text-black/30">Stack Technique</h3>
        <div className="ml-4 flex-grow border-t border-dashed border-[black]/10" />
      </div>

      {/* Tech Stack */}
      {techStacks.length > 0 && (
        <div>
          <div className="flex flex-wrap gap-2">
            {techStacks.map((tech, index) => (
              <StackLogo
                key={index}
                name={tech.name}
                icon={tech.iconUrl || "/icons/empty-project.svg"}
                alt={tech.name}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-xs font-normal text-black/30">
          Contributeurs Principaux
        </h3>
        <div className="ml-4 flex-grow border-t border-dashed border-[black]/10" />
      </div>

      {/* Contributors Avatars */}
      <div>
        <div className="flex gap-2">
          {Array.from({ length: Math.min(contributors, 3) }).map((_, index) => {
            // Alterner entre les différentes icônes de contributeurs
            const contributorIcons = [
              "/icons/exemplebyronIcon.svg",
              "/icons/killiancodes-icon.jpg",
              "/icons/p2aco-icon.png",
              "/icons/empty-project.svg",
            ];
            const iconSrc = contributorIcons[index % contributorIcons.length];

            return (
              <div
                key={index}
                className="h-8 w-8 overflow-hidden rounded-full bg-gray-300"
              >
                <Image
                  src={iconSrc}
                  alt={`Contributor ${index + 1}`}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function SkeletonProjectSideBar() {
  return (
    <div className="flex w-[270px] flex-col gap-6 rounded-2xl border border-[black]/10 bg-white p-6 shadow-[0_0_0.5px_0_rgba(0,0,0,0.20)]">
      {/* Project Image Skeleton */}
      <Skeleton className="h-[252px] w-[252px] self-center rounded-[16px]" />

      {/* Title Skeleton */}
      <Skeleton className="h-8 w-32 self-center" />

      {/* Stats Skeleton */}
      <div className="flex items-center justify-center gap-4">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-8" />
      </div>

      {/* Buttons Skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Tech Stack Skeleton */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[28px] w-[60px]" />
        ))}
      </div>

      {/* Contributors Skeleton */}
      <div>
        <Skeleton className="mb-2 h-4 w-24" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
