import { useSearchParams } from "next/navigation";
import { HiMiniSquare2Stack } from "react-icons/hi2";

import ProjectCardComponent from "@/shared/components/shared/ProjectCard";
import { DataTablePagination } from "@/shared/components/ui/data-table-pagination.component";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";

import { useMyProjects } from "@/features/dashboard/hooks/use-my-projects.hook";
import { ProjectQueryParams } from "@/features/dashboard/services/my-projects.service";

import ProfileProjectsSkeleton from "./skeletons/profile-projects-skeleton.component";

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export default function ProfileProjectsList() {
  const searchParams = useSearchParams();

  const page = parseNumber(searchParams.get("page"), 1);
  const perPage = parseNumber(searchParams.get("per_page"), 6);
  const queryParams: ProjectQueryParams = {
    page,
    per_page: perPage,
    published: true,
  };

  const {
    data: projectsResponse,
    isLoading,
    isError,
  } = useMyProjects(queryParams);
  const projects = projectsResponse?.data || [];
  const pagination = projectsResponse?.pagination;

  if (isLoading) return <ProfileProjectsSkeleton />;
  if (isError)
    return (
      <ErrorState
        message="Failed to fetch projects"
        queryKey={["user", "me", "projects"]}
      />
    );

  if (projects.length === 0)
    return (
      <EmptyState
        title="No projects"
        description="No projects have been joined yet"
        icon={HiMiniSquare2Stack}
      />
    );

  return (
    <div className="flex w-full flex-col gap-6">
      {projects.map((project) => (
        <ProjectCardComponent
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
          className="w-full"
        />
      ))}

      {pagination && (
        <div className="mt-4">
          <DataTablePagination pagination={pagination} />
        </div>
      )}
    </div>
  );
}
