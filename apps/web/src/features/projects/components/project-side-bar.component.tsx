import Image from "next/image";
import Link from "next/link";

import StackLogo from "@/shared/components/logos/stack-logo";
import { Avatar } from "@/shared/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/icon";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { Project } from "../types/project.type";

interface ProjectSideBarProps {
  project: Project;
  isMaintainer?: boolean;
}

export default function ProjectSideBar({
  project,
  isMaintainer = false,
}: ProjectSideBarProps) {
  const {
    title = "",
    techStacks = [],
    externalLinks = [],
    categories = [],
    lastCommitAt = "",
    projectStats = {
      stars: 0,
      forks: 0,
      contributors: 0,
    },
  } = project;

  // Récupérer le lien GitHub
  const githubLink =
    externalLinks.find((link) => link.type === "github")?.url || "";

  const collaborators = project.collaborators || [];

  return (
    <div className="flex flex-col gap-5 bg-white">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-3">
        <BreadcrumbList className="gap-3 text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-black/50">
              Accueil
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Image
              src="/icons/breadcrumb-chevron-icon.svg"
              alt="chevron"
              width={5}
              height={5}
            />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Action Buttons */}
      <div className="mb-3 flex gap-2">
        {isMaintainer ? (
          <Button size="lg" className="gap-2">
            Modifier la page
            <Image
              src="/icons/edit-white-icon.svg"
              alt="pencil"
              width={12}
              height={12}
            />
          </Button>
        ) : (
          <Button size="lg">Rejoindre le projet</Button>
        )}
        <Link href={githubLink} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="lg">
            Voir le Repo
            <Icon name="github" size="sm" />
          </Button>
        </Link>
      </div>

      {/* Details Section */}
      <div className="mb-2 flex flex-col">
        <h2 className="text-md mb-1 font-medium text-black">Details</h2>

        {/* Stars */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Icon
              name="star"
              size="sm"
              variant="black"
              className="opacity-50"
            />
            <span className="text-sm font-normal text-black/50">Stars</span>
          </div>
          <div className="mx-4 flex flex-1 items-center">
            <div className="h-[1px] w-full bg-black/5" />
          </div>
          <span className="text-sm font-medium text-black">
            {projectStats.stars}
          </span>
        </div>

        {/* Forks */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Icon
              name="fork"
              size="sm"
              variant="black"
              className="opacity-50"
            />
            <span className="text-sm font-normal text-black/50">Forks</span>
          </div>
          <div className="mx-4 flex flex-1 items-center">
            <div className="h-[1px] w-full bg-black/5" />
          </div>
          <span className="text-sm font-medium text-black">
            {projectStats.forks}
          </span>
        </div>

        {/* Last Commit */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Icon name="last-commit" size="sm" variant="default" />
            <span className="text-sm font-normal text-black/50">
              Last Commit
            </span>
          </div>
          <div className="mx-4 flex flex-1 items-center">
            <div className="h-[1px] w-full bg-black/5" />
          </div>
          <span className="text-sm font-medium text-black">
            {lastCommitAt
              ? new Date(lastCommitAt).toLocaleDateString("fr-FR")
              : "N/A"}
          </span>
        </div>

        {/* Contributors */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Icon
              name="people"
              size="sm"
              variant="black"
              className="opacity-50"
            />
            <span className="text-sm font-normal text-black/50">
              Contributors
            </span>
          </div>
          <div className="mx-4 flex flex-1 items-center">
            <div className="h-[1px] w-full bg-black/5" />
          </div>
          <span className="text-sm font-medium text-black">
            {projectStats.contributors}
          </span>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="mb-2 flex flex-col">
        <h2 className="text-md mb-2 font-medium text-black">Stack Technique</h2>
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
      </div>

      {/* Categories Section */}
      <div className="mb-2 flex flex-col">
        <h2 className="text-md mb-2 font-medium text-black">Catégories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex h-[20px] min-w-[65px] items-center justify-center rounded-full bg-[#FAFAFA] px-3 text-xs font-medium text-black/50"
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>

      {/* Contributors Section */}
      <div className="flex flex-col">
        <h2 className="text-md mb-2 font-medium text-black">
          Contributeurs Principaux
        </h2>
        {/* Contributors Avatars */}
        <div>
          <div className="flex gap-2">
            {collaborators.slice(0, 5).map((collaborator) => (
              <Avatar
                key={collaborator.id}
                src={collaborator.avatarUrl}
                name={collaborator.name}
                alt={collaborator.name}
                size="sm"
              />
            ))}

            {/* Indicateur "+X autres" si plus de 5 collaborateurs */}
            {collaborators.length > 5 && (
              <div className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                +{collaborators.length - 5}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-md font-medium text-black">Liens</h2>
        <div className="flex gap-4">
          <Image
            src="/icons/x-gray-icon.svg"
            alt="link"
            width={22}
            height={22}
            className="h-5 w-5"
          />
          <Image
            src="/icons/linkedin-gray-icon.svg"
            alt="link"
            width={22}
            height={22}
            className="h-5 w-5"
          />
          <Image
            src="/icons/github-gray-icon.svg"
            alt="link"
            width={22}
            height={22}
            className="h-5 w-5"
          />

          <Image
            src="/icons/link-gray-icon.svg"
            alt="link"
            width={22}
            height={22}
            className="h-5 w-5"
          />
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
