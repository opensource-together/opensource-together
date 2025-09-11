"use client";

import { EmptyState } from "@/shared/components/ui/empty-state";
import PaginationNavigation from "@/shared/components/ui/pagination-navigation";

import ProjectDiscoveryHero from "@/features/projects/components/project-discovery-hero.component";

import HomepageError from "../components/error-ui/homepage-error.component";
import ProjectGrid from "../components/project-grid.component";
import SkeletonProjectGrid from "../components/skeletons/skeleton-project-grid.component";
import { useProjects } from "../hooks/use-projects.hook";

export default function HomepageView() {
  const { data: projects, isError, isFetching } = useProjects();
  if (isError || !projects) return <HomepageError />;

  return (
    <>
      <div className="mt-8 flex flex-col items-center">
        <ProjectDiscoveryHero />
      </div>
      <div className="mx-6 max-w-6xl lg:mx-auto">
        <div className="pb-4 md:pb-8">
          {isFetching ? (
            <div className="mt-6">
              <SkeletonProjectGrid />
            </div>
          ) : projects.length === 0 ? (
            <EmptyState
              title="Aucun Projet Disponible"
              description="Aucun projet n'a été trouvé pour le moment. Veuillez réessayer plus tard."
              className="mb-28"
            />
          ) : (
            <div className="mt-6">
              <ProjectGrid projects={projects} />
              {projects.length > 8 && (
                <div className="mt-8.5 mb-50">
                  <PaginationNavigation />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
