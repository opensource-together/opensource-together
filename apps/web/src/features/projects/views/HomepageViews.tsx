"use client";

import ProjectDiscoveryHero from "@/features/projects/components/ProjectDiscoveryHero";

import Pagination from "@/components/shared/Pagination";
import Footer from "@/components/shared/layout/Footer";

import ProjectGrid from "../components/ProjectGrid";
import HomepageError from "../components/error-ui/HomepageError";
import SkeletonHomepageViews from "../components/skeletons/SkeletonHomepageViews";
import { useProjects } from "../hooks/useProjects";

export default function HomepageViews() {
  const { data: projects, isLoading, isError } = useProjects();

  if (isLoading) return <SkeletonHomepageViews />;
  if (isError || !projects) return <HomepageError />;

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="mx-auto mt-4 flex flex-col items-center px-4 sm:px-6 md:mt-8 md:px-8 lg:px-0">
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
