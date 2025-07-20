"use client";

import Pagination from "@/shared/components/shared/Pagination";
import { EmptyState } from "@/shared/components/ui/empty-state";

import ProjectDiscoveryHero from "@/features/projects/components/project-discovery-hero.component";

import HomepageError from "../components/error-ui/homepage-error.component";
import ProjectGrid from "../components/project-grid.component";
import SkeletonHomepageViews from "../components/skeletons/skeleton-homage-view.component";
import { useProjects } from "../hooks/use-projects.hook";

export default function HomepageView() {
  const { data: projects, isLoading, isError } = useProjects();

  if (isLoading) return <SkeletonHomepageViews />;
  if (isError || !projects) return <HomepageError />;

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="mx-auto mt-8 flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-0">
        <ProjectDiscoveryHero />
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6 md:px-8 md:py-8 lg:px-12">
        {projects.length === 0 ? (
          <EmptyState
            title="Aucun Projet Disponible"
            description="Aucun projet n'a été trouvé pour le moment. Veuillez réessayer plus tard."
            className="mb-28"
          />
        ) : (
          <>
            <ProjectGrid projects={projects} />
            <div className="mt-25 mb-50">
              <Pagination />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
