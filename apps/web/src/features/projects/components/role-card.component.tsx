"use client";

import StackLogo from "@/shared/components/logos/stack-logo";
import { Button } from "@/shared/components/ui/button";
import Icon from "@/shared/components/ui/icon";
import { Skeleton } from "@/shared/components/ui/skeleton";

import EditRoleForm from "../forms/edit-role.form";
import RoleApplicationForm from "../forms/role-application.form";
import { ProjectRole, TechStack } from "../types/project.type";

interface RoleCardProps {
  role: ProjectRole;
  techStacks?: TechStack[];
  className?: string;
  isMaintainer?: boolean;
}

export default function RoleCard({
  role,
  techStacks = [],
  className,
  isMaintainer = false,
}: RoleCardProps) {
  const {
    title = "",
    description = "",
    techStacks: roleTechStacks = [],
  } = role;

  const getTechIcon = (techStackName: string): string => {
    const specialMappings: Record<string, string> = {
      React:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
      Tailwind:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
      JavaScript:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
      TypeScript:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
      Figma:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
      Docker:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg",
      Git: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
      Markdown:
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/markdown/markdown-original.svg",
    };

    if (specialMappings[techStackName]) {
      return specialMappings[techStackName];
    }

    const techStack = techStacks.find(
      (tech) =>
        tech.name.toLowerCase() === techStackName.toLowerCase() ||
        tech.name.toLowerCase().includes(techStackName.toLowerCase()) ||
        techStackName.toLowerCase().includes(tech.name.toLowerCase())
    );

    return techStack?.iconUrl || "/icons/mongodb.svg"; // Fallback
  };

  return (
    <div
      className={`w-full max-w-[668px] rounded-3xl border border-[black]/5 p-4 shadow-xs md:p-6 ${className}`}
    >
      {/* Role Title */}
      <h3 className="mb-3 text-lg font-medium tracking-tighter text-black md:mb-4">
        {title}
      </h3>

      {/* Role Description */}
      <p className="mb-4 text-sm leading-relaxed tracking-tighter text-black/70 md:mb-6">
        {description}
      </p>

      {/* Ligne de séparation */}
      <div className="mb-3 w-full border-t border-dashed border-black/8"></div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-0">
        {/* Tech Badges */}
        <div className="flex flex-wrap gap-2">
          {roleTechStacks.length > 0 ? (
            roleTechStacks.map((techStack: TechStack) => (
              <StackLogo
                key={`${techStack.id}`}
                name={techStack.name}
                icon={techStack.iconUrl || getTechIcon(techStack.name)}
                alt={techStack.name}
              />
            ))
          ) : (
            // Default MongoDB badges for demo
            <>
              <StackLogo
                name="MongoDB"
                icon="/icons/mongodb.svg"
                alt="MongoDB"
              />
              <StackLogo
                name="MongoDB"
                icon="/icons/mongodb.svg"
                alt="MongoDB"
              />
              <StackLogo
                name="MongoDB"
                icon="/icons/mongodb.svg"
                alt="MongoDB"
              />
            </>
          )}
        </div>

        {/* Apply Button */}
        {isMaintainer ? (
          <EditRoleForm role={role} availableTechStacks={techStacks}>
            <Button variant="outline" className="w-full md:w-auto">
              Modifier le rôle
            </Button>
          </EditRoleForm>
        ) : (
          <RoleApplicationForm
            roleTitle={title}
            roleDescription={description}
            techStacks={roleTechStacks.map((roleTech) => {
              const fullTechStack = techStacks.find(
                (tech) =>
                  tech.name.toLowerCase() === roleTech.name.toLowerCase()
              );
              return (
                fullTechStack || {
                  ...roleTech,
                  iconUrl: getTechIcon(roleTech.name),
                }
              );
            })}
          >
            <Button className="w-full md:w-auto">
              Postuler à ce rôle
              <Icon name="arrow-up-right" size="xs" variant="white" />
            </Button>
          </RoleApplicationForm>
        )}
      </div>
    </div>
  );
}

export function SkeletonRoleCard() {
  return (
    <div className="mb-6 flex min-h-[310px] w-[668px] flex-col rounded-lg border border-[black]/10 bg-white p-6 shadow-[0_0_0.5px_0_rgba(0,0,0,0.20)]">
      {/* Title skeleton */}
      <Skeleton className="mb-4 h-6 w-48" />

      {/* Description skeleton */}
      <div className="mb-6">
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Good first issue section skeleton */}
      <div className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="mb-6 flex items-start gap-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* Bottom section skeleton */}
      <div className="mt-auto flex items-center justify-between">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-16" />
          ))}
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
