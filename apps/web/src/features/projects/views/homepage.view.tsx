"use client";

import Footer from "@/shared/components/layout/footer";
import Pagination from "@/shared/components/shared/Pagination";

import ProjectDiscoveryHero from "@/features/projects/components/project-discovery-hero";

import HomepageError from "../components/error-ui/homepage-error";
import ProjectGrid from "../components/project-grid";
import SkeletonHomepageViews from "../components/skeletons/skeleton-homage-view";
import { useProjects } from "../hooks/use-projects.hook";

export default function HomepageViews() {
  const { data: projects, isLoading, isError } = useProjects();

  if (isLoading) return <SkeletonHomepageViews />;
  if (isError || !projects) return <HomepageError />;

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="mx-auto mt-8 flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-0">
        <ProjectDiscoveryHero />
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6 md:px-8 md:py-8 lg:px-12">
        <ProjectGrid projects={projects} />

        <div className="mt-25 mb-50">
          <Pagination />
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
