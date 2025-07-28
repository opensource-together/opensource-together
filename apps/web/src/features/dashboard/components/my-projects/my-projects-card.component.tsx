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

import { Project, TechStack } from "@/features/projects/types/project.type";

interface MyProjectsCardProps {
  project: Project;
  techStacks?: TechStack[];
  className?: string;
}

export default function MyProjectsCardComponent({
  project,
  techStacks = [],
  className = "",
}: MyProjectsCardProps) {
  const displayTechStacks =
    techStacks.length > 0 ? techStacks : project.techStacks || [];

  return (
    <div className="block">
      <ProjectCard className={className}>
        <ProjectCardHeader>
          <ProjectCardLeftGroup>
            <Avatar src={project.imageUrl} name={project.title} size="lg" />
            <ProjectCardInfo>
              <ProjectCardTitle>{project.title}</ProjectCardTitle>
              <p className="text-muted-foreground -mt-1 text-sm tracking-tighter">
                by {project.author.name}
              </p>
            </ProjectCardInfo>
          </ProjectCardLeftGroup>
        </ProjectCardHeader>
        <ProjectCardContent>
          <ProjectCardDescription>
            {project.shortDescription}
          </ProjectCardDescription>
          <ProjectCardDivider />
          {displayTechStacks.length > 0 && (
            <ProjectCardFooter>
              <>
                <div className="flex gap-5">
                  {displayTechStacks
                    .slice(0, 3)
                    .map((tech: TechStack, index: number) => (
                      <StackLogo
                        key={tech.id || index}
                        icon={tech.iconUrl || ""}
                        alt={tech.name}
                        name={tech.name}
                      />
                    ))}
                </div>
                {displayTechStacks.length > 3 && (
                  <span className="flex h-5.5 flex-shrink-0 items-center rounded-full bg-transparent text-xs whitespace-nowrap text-black/20">
                    +{displayTechStacks.length - 3}
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
