"use client";

import { EmptyState } from "@/shared/components/ui/empty-state";
import PaginationNavigation from "@/shared/components/ui/pagination-navigation";

import ProjectDiscoveryHero from "@/features/projects/components/project-discovery-hero.component";

import HomepageError from "../components/error-ui/homepage-error.component";
import ProjectGrid from "../components/project-grid.component";
import SkeletonProjectGrid from "../components/skeletons/skeleton-project-grid.component";
import { useProjects } from "../hooks/use-projects.hook";

function HomepageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mt-8 flex flex-col items-center">
        <ProjectDiscoveryHero />
      </div>
      <div className="mx-6 max-w-6xl pb-4 md:pb-8 lg:mx-auto">{children}</div>
    </>
  );
}

export default function HomepageView() {
  const { data: projects, isError, isLoading } = useProjects();

  if (isError) {
    return (
      <HomepageLayout>
        <HomepageError />
      </HomepageLayout>
    );
  }

  if (isLoading) {
    return (
      <HomepageLayout>
        <div className="mt-6">
          <SkeletonProjectGrid />
        </div>
      </HomepageLayout>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <HomepageLayout>
        <EmptyState
          text="Aucun Projet Disponible"
          buttonText="Réessayer"
          href="/"
          className="mb-28"
        />
      </HomepageLayout>
    );
  }

  return (
    <HomepageLayout>
      <div className="mt-6">
        <ProjectGrid projects={projects} />
        {projects.length > 8 && (
          <div className="mt-[8.5px] mb-[50px]">
            <PaginationNavigation />
          </div>
        )}
      </div>
    </HomepageLayout>
  );
}
