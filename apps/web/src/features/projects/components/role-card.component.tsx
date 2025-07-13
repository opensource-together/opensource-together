"use client";

import StackLogo from "@/shared/components/logos/stack-logo";
import { Button } from "@/shared/components/ui/button";
import Icon from "@/shared/components/ui/icon";

import EditRoleForm from "../forms/edit-role.form";
import RoleApplicationForm from "../forms/role-application.form";
import { ProjectGoal, ProjectRole, TechStack } from "../types/project.type";

interface RoleCardProps {
  role: ProjectRole;
  techStacks?: TechStack[];
  projectGoals?: ProjectGoal[];
  className?: string;
  isMaintainer?: boolean;
  projectId?: string;
}

export default function RoleCard({
  role,
  techStacks = [],
  projectGoals = [],
  className,
  isMaintainer = false,
  projectId = "",
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
      className={`w-full max-w-[668px] rounded-[20px] border border-[black]/5 p-4 shadow-xs md:p-6 ${className}`}
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
      <div className="mb-3 w-full border-t border-black/5"></div>

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
          <EditRoleForm role={role} projectId={projectId}>
            <Button variant="outline">Modifier le rôle</Button>
          </EditRoleForm>
        ) : (
          <RoleApplicationForm
            roleTitle={title}
            roleDescription={description}
            projectGoals={projectGoals}
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
            <Button>
              Postuler à ce rôle
              <Icon name="arrow-up-right" size="xs" variant="white" />
            </Button>
          </RoleApplicationForm>
        )}
      </div>
    </div>
  );
}
