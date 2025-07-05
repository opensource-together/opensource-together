import ProjectCard from "@/shared/components/shared/ProjectCard";

import { Project } from "../types/project.type";

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
          shortDescription={project.shortDescription}
          image={project.image}
          techStacks={project.techStacks}
          roles={project.roles}
          author={project.author}
          projectStats={project.projectStats}
          showViewProject={true}
        />
      ))}
    </div>
  );
}
