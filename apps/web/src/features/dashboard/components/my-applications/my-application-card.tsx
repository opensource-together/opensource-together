"use client";

import StackLogo from "@/shared/components/logos/stack-logo";
import { Avatar } from "@/shared/components/ui/avatar";
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

import { ProjectRoleApplicationType } from "../../types/project-role-application.type";

interface MyApplicationsCardProps {
  application: ProjectRoleApplicationType;
  onClick?: () => void;
  isSelected?: boolean;
}

export function MyApplicationsCard({
  application,
  onClick,
  isSelected,
}: MyApplicationsCardProps) {
  return (
    <div onClick={onClick}>
      <ProjectCard
        className={`rounded-[20px] ${isSelected ? "shadow-[0_0_8px_rgba(0,0,0,0.1)]" : ""}`}
      >
        <ProjectCardHeader>
          <ProjectCardLeftGroup>
            <Avatar
              src={application.project.image}
              name={application.project.title}
              alt={application.project.title}
              size="lg"
            />
            <ProjectCardInfo>
              <ProjectCardTitle>
                {application.projectRole.title}{" "}
                <span className="font-normal text-black/50">
                  — {application.project.title}
                </span>
              </ProjectCardTitle>
              <p className="text-muted-foreground -mt-1 text-sm tracking-tighter">
                by {application.project.owner.username}
              </p>
            </ProjectCardInfo>
          </ProjectCardLeftGroup>
        </ProjectCardHeader>
        <ProjectCardContent>
          <ProjectCardDescription>
            {application.project.shortDescription}
          </ProjectCardDescription>
          <ProjectCardDivider />
          {application.projectRole.techStacks.length > 0 && (
            <ProjectCardFooter>
              <>
                <div className="flex gap-5">
                  {application.projectRole.techStacks
                    .slice(0, 3)
                    .map((tech) => (
                      <StackLogo
                        key={tech.id}
                        name={tech.name}
                        icon={tech.iconUrl || ""}
                        alt={tech.name}
                      />
                    ))}
                </div>
                {application.projectRole.techStacks.length > 3 && (
                  <span className="flex h-5.5 flex-shrink-0 items-center rounded-full bg-transparent text-xs whitespace-nowrap text-black/20">
                    +{application.projectRole.techStacks.length - 3}
                  </span>
                )}
              </>
            </ProjectCardFooter>
          )}
        </ProjectCardContent>
      </ProjectCard>
    </div>
  );
}
