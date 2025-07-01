import Image from "next/image";

import StackLogo from "@/shared/components/logos/stack-logo";
import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/icon";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { Project } from "../types/project.type";

interface ProjectSideBarProps {
  project: Project;
}

export default function ProjectSideBar({ project }: ProjectSideBarProps) {
  const {
    title = "",
    techStacks = [],
    socialLinks = [],
    communityStats: { stars = 0, contributors = 0, forks = 0 } = {},
  } = project;

  // Récupérer le lien GitHub
  const githubLink = socialLinks.find((link) => link.type === "github")?.url;

  // Données fictives des contributeurs pour tester l'Avatar
  const contributorsData = [
    { name: "Byron M", avatar: "/icons/exemplebyronIcon.svg" },
    { name: "Killian C", avatar: "/icons/killiancodes-icon.jpg" },
    { name: "P2aco Dev", avatar: "/icons/p2aco-icon.png" },
  ];

  return (
    <div className="flex flex-col gap-5 bg-white">
      {/* Stats */}
      <div className="flex items-center justify-start gap-2 px-2 text-sm text-black/70">
        <div className="flex items-center gap-1">
          <Icon name="fork" size="sm" variant="black" />
          <span className="text-xs text-black">{forks}</span>
        </div>
        <div className="flex items-center gap-1">
          <Icon name="people" size="sm" variant="black" />
          <span className="text-xs text-black">{contributors}</span>
        </div>
        <div className="mt-[1px] flex items-center gap-1">
          <Icon name="star" size="sm" variant="black" />
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
              <Icon name="github" size="sm" />
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
        <h3 className="mb-3 text-sm font-medium tracking-tighter text-black/80">
          Contributeurs ({contributors})
        </h3>
        <div className="flex gap-2">
          {Array.from({ length: Math.min(contributors, 5) }).map((_, index) => {
            const contributor =
              contributorsData[index % contributorsData.length];

            return (
              <Avatar
                key={index}
                src={contributor.avatar}
                name={contributor.name}
                alt={contributor.name}
                size="sm"
              />
            );
          })}

          {/* Indicateur "+X autres" si plus de 5 contributeurs */}
          {contributors > 5 && (
            <div className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
              +{contributors - 5}
            </div>
          )}
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
