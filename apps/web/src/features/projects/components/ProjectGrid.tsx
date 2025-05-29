import ProjectCard from "@/components/shared/ProjectCard";

import { Project } from "../types/projectTypes";

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
      {projects?.map((project) => (
        <ProjectCard
          key={project.id}
          projectId={project.id}
          title={project.title}
          description={project.description}
          image={project.image}
          techStack={project.techStacks
            ?.filter((tech) => typeof tech.iconUrl === "string")
            .map((tech) => ({
              icon: tech.iconUrl as string,
              alt: tech.name,
            }))}
          stars={project.communityStats?.stars || 0}
          roles={project.roles?.map((role) => ({
            name: role.title,
          }))}
          roleCount={project.roles?.length || 0}
          authorName={project.authorName}
          communityStats={project.communityStats}
        />
      ))}
    </div>
  );
}
