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
          owner={{
            id: project.owner?.id || "",
            username: project.owner?.username || "",
            avatarUrl: project.owner?.avatarUrl || "",
          }}
          projectStats={{
            forks: project.repositoryDetails?.forksCount || 0,
            contributors: project.repositoryDetails?.contributors || [],
            stars: project.repositoryDetails?.stars || 0,
            watchers: project.repositoryDetails?.subscribersCount || 0,
            openIssues: project.repositoryDetails?.openIssuesCount || 0,
            commits: 0,
            lastCommit: {
              sha: "",
              message: "",
              date: "",
              url: "",
              author: {
                login: project.repositoryDetails?.owner?.login,
                avatar_url: project.repositoryDetails?.owner?.avatar_url,
                html_url: project.repositoryDetails?.html_url,
              },
            },
          }}
        />
      ))}
    </div>
  );
}
