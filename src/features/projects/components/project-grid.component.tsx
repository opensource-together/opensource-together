import ProjectCard from "@/shared/components/shared/ProjectCard";

import { useProjectRepositorySummary } from "../../../shared/hooks/use-git-repo-summary.hook";
import { Project } from "../types/project.type";

interface ProjectGridProps {
  projects: Project[];
}

function ProjectGridItem({ project }: { project: Project }) {
  const { data: repoSummary, isLoading: isRepoLoading } =
    useProjectRepositorySummary(project.id);

  const repositoryDetails = {
    languages:
      repoSummary?.languages ?? project.repositoryDetails?.languages ?? {},
    forksCount:
      repoSummary?.forksCount ?? project.repositoryDetails?.forksCount ?? 0,
    stars: repoSummary?.stars ?? project.repositoryDetails?.stars ?? 0,
    openIssuesCount:
      repoSummary?.openIssuesCount ??
      project.repositoryDetails?.openIssuesCount ??
      0,
  };

  return (
    <ProjectCard
      key={project.id}
      projectId={project.id}
      title={project.title}
      description={project.description}
      logoUrl={project.logoUrl || ""}
      repoUrl={project.repoUrl || ""}
      projectTechStacks={project.projectTechStacks}
      repositoryDetails={repositoryDetails}
      isRepositoryLoading={isRepoLoading}
    />
  );
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6.5">
      {projects?.map((project) => (
        <ProjectGridItem key={project.id} project={project} />
      ))}
    </div>
  );
}
