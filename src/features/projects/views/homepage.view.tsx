"use client";

import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import PaginationNavigation from "@/shared/components/ui/pagination-navigation";

import ProjectDiscoveryHero from "@/features/projects/components/project-discovery-hero.component";

import ProjectGrid from "../components/project-grid.component";
import SkeletonProjectGrid from "../components/skeletons/skeleton-project-grid.component";
import { useProjects } from "../hooks/use-projects.hook";

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
  const { data: projects, isError, isLoading } = useProjects();

  if (!projects && isLoading) {
    return (
      <HomepageLayout>
        <SkeletonProjectGrid />
      </HomepageLayout>
    );
  }

  if (!projects && isError) {
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

      <div className="mt-8 mb-[50px]">
        <PaginationNavigation />
      </div>
    </HomepageLayout>
  );
}
