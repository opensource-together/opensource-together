import { useSearchParams } from "next/navigation";
import { HiMiniSquare2Stack, HiPlus } from "react-icons/hi2";

import ProjectCardComponent from "@/shared/components/shared/ProjectCard";
import { DataTablePagination } from "@/shared/components/ui/data-table-pagination.component";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import { useProjectRepositorySummary } from "@/shared/hooks/use-git-repo-summary.hook";

import type { Project } from "@/features/projects/types/project.type";

import { useUserProjects } from "../hooks/use-profile.hook";
import ProfileProjectsSkeleton from "./skeletons/profile-projects-skeleton.component";

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

function ProfileProjectItem({ project }: { project: Project }) {
  const { data: repoSummary, isLoading } = useProjectRepositorySummary(
    project.id
  );

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
    <ProjectCardComponent
      key={project.id}
      projectId={project.id}
      title={project.title}
      description={project.description}
      logoUrl={project.logoUrl || ""}
      projectTechStacks={project.projectTechStacks}
      repoUrl={project.repoUrl || ""}
      repositoryDetails={repositoryDetails}
      isRepositoryLoading={isLoading}
      className="w-full"
    />
  );
}

interface ProfileProjectsListProps {
  userId: string;
}

export default function ProfileProjectsList({
  userId,
}: ProfileProjectsListProps) {
  const searchParams = useSearchParams();

  const page = parseNumber(searchParams.get("page"), 1);
  const perPage = parseNumber(searchParams.get("per_page"), 6);

  const {
    data: projectsResponse,
    isLoading,
    isError,
  } = useUserProjects(
    userId,
    {
      page,
      per_page: perPage,
      published: true,
    },
    { enabled: !!userId }
  );
  const projects = projectsResponse?.data || [];
  const pagination = projectsResponse?.pagination;

  if (isLoading) return <ProfileProjectsSkeleton />;
  if (isError)
    return (
      <ErrorState
        message="Failed to fetch projects"
        queryKey={["users", userId, "projects"]}
      />
    );

  if (projects.length === 0)
    return (
      <EmptyState
        title="No projects"
        description="No projects have been joined yet"
        icon={HiMiniSquare2Stack}
        buttonText="Create a project"
        href="/projects/create"
        buttonIcon={HiPlus}
      />
    );

  return (
    <div className="flex w-full flex-col gap-6">
      {projects.map((project) => (
        <ProfileProjectItem key={project.id} project={project} />
      ))}

      {pagination && (
        <div className="mt-4">
          <DataTablePagination pagination={pagination} />
        </div>
      )}
    </div>
  );
}
