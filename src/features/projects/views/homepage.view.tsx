"use client";

import { useSearchParams } from "next/navigation";

import { DataTablePagination } from "@/shared/components/ui/data-table-pagination.component";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";

import ProjectDiscoveryHero from "@/features/projects/components/project-discovery-hero.component";

import ProjectGrid from "../components/project-grid.component";
import SkeletonProjectGrid from "../components/skeletons/skeleton-project-grid.component";
import { useProjects } from "../hooks/use-projects.hook";
import { ProjectQueryParams } from "../services/project.service";

const parseNumber = (value: string | null, fallback: number): number => {
  const n = value ? Number(value) : NaN;
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

function HomepageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col items-center">
        <ProjectDiscoveryHero />
      </div>
      <div className="mx-6 max-w-6xl pb-4 md:pb-8 lg:mx-auto">{children}</div>
    </>
  );
}

export default function HomepageView() {
  const searchParams = useSearchParams();

  const page = parseNumber(searchParams.get("page"), 1);
  const perPage = parseNumber(searchParams.get("per_page"), 50);
  const queryParams: ProjectQueryParams = { page, per_page: perPage };

  const {
    data: projectsResponse,
    isError,
    isLoading,
  } = useProjects(queryParams);

  const projects = projectsResponse?.data || [];
  const pagination = projectsResponse?.pagination;

  if (isLoading) {
    return (
      <HomepageLayout>
        <SkeletonProjectGrid />
      </HomepageLayout>
    );
  }

  if (isError) {
    return (
      <HomepageLayout>
        <ErrorState
          message="An error has occurred while loading the projects. Please try again later."
          queryKey={["projects"]}
        />
      </HomepageLayout>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <HomepageLayout>
        <EmptyState title="No projects available" className="mb-28" />
      </HomepageLayout>
    );
  }

  return (
    <HomepageLayout>
      <ProjectGrid projects={projects} />

      {pagination && (
        <div className="mt-8 mb-[50px]">
          <DataTablePagination pagination={pagination} />
        </div>
      )}
    </HomepageLayout>
  );
}
