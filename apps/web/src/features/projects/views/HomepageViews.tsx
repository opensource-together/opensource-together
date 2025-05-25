"use client";

import Billboard from "@/components/shared/Billboard";
import Pagination from "@/components/shared/Pagination";
import Footer from "@/components/shared/layout/Footer";

import ProjectFilters from "../components/ProjectFilters";
import ProjectGrid from "../components/ProjectGrid";
import ProjectSearchBar from "../components/ProjectSearchBar";
import HomepageError from "../components/error-ui/HomepageError";
import SkeletonHomepageViews from "../components/skeletons/SkeletonHomepageViews";
import { useProjects } from "../hooks/useProjects";

export default function HomepageViews() {
  const { data: projects, isLoading, isError } = useProjects();

  if (isLoading || !projects) return <SkeletonHomepageViews />;
  if (isError) return <HomepageError />;

  return (
    <div className="space-y-4 pb-10 md:space-y-5">
      <div className="mx-auto mt-4 flex flex-col items-center px-4 sm:px-6 md:mt-8 md:px-8 lg:px-0">
        <Billboard />
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6 md:px-8 md:py-8 lg:px-12">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <ProjectFilters
            filters={[
              { label: "", value: "Plus Récent", isSortButton: true },
              { label: "Technologie", value: "" },
              { label: "Rôle", value: "" },
              { label: "Difficulté", value: "" },
            ]}
          />
          <ProjectSearchBar />
        </div>

        <ProjectGrid projects={projects} />

        <div className="mt-25">
          <Pagination />
        </div>
      </div>
      <div className="mt-20 px-4 sm:px-6 md:px-8">
        <Footer />
      </div>
    </div>
  );
}
