"use client";

import { useSearchParams } from "next/navigation";
import { HiBookmark } from "react-icons/hi2";
import type { Project } from "@/features/projects/types/project.type";
import ProjectCardComponent from "@/shared/components/shared/ProjectCard";
import { DataTablePagination } from "@/shared/components/ui/data-table-pagination.component";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import { useProjectRepositorySummary } from "@/shared/hooks/use-git-repo-summary.hook";

import { useUserBookmarks } from "../hooks/use-profile.hook";
import ProfileProjectsSkeleton from "./skeletons/profile-projects-skeleton.component";

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

function SavedProjectItem({ project }: { project: Project }) {
  const projectId = project.id || project.publicId || "";
  const { data: repoSummary, isLoading } =
    useProjectRepositorySummary(projectId);

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
      key={projectId}
      projectId={projectId}
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

export default function ProfileSavedProjectsList() {
  const searchParams = useSearchParams();
  const page = parseNumber(searchParams.get("page"), 1);
  const perPage = parseNumber(searchParams.get("per_page"), 6);

  const {
    data: bookmarksResponse,
    isLoading,
    isError,
  } = useUserBookmarks(
    {
      page,
      per_page: perPage,
    },
    { enabled: true }
  );

  const projects = bookmarksResponse?.data || [];
  const pagination = bookmarksResponse?.pagination;

  if (isLoading) return <ProfileProjectsSkeleton />;
  if (isError)
    return (
      <ErrorState
        message="Failed to fetch saved projects"
        queryKey={["user", "me", "bookmarks"]}
      />
    );

  if (projects.length === 0)
    return (
      <EmptyState
        title="No saved projects"
        description="Bookmark projects to keep them handy here."
        icon={HiBookmark}
      />
    );

  return (
    <div className="flex w-full flex-col gap-6">
      {projects.map((project) => (
        <SavedProjectItem
          key={project.id || project.publicId}
          project={project}
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
