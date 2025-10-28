import ProjectCard from "@/shared/components/shared/ProjectCard";

import { Project } from "../types/project.type";

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6.5">
      {projects?.map((project) => (
        <ProjectCard
          key={project.id}
          projectId={project.id}
          title={project.title}
          description={project.description}
          logoUrl={project.logoUrl || ""}
          projectTechStacks={project.projectTechStacks}
          repositoryDetails={{
            languages: project.repositoryDetails?.languages || {},
            forksCount: project.repositoryDetails?.forksCount || 0,
            stars: project.repositoryDetails?.stars || 0,
            openIssuesCount: project.repositoryDetails?.openIssuesCount || 0,
            pullRequestsCount:
              project.repositoryDetails?.pullRequestsCount || 0,
            owner: project.repositoryDetails?.owner || {
              login: "",
              avatar_url: "",
            },
          }}
        />
      ))}
    </div>
  );
}
