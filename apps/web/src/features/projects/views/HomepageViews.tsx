"use client";
import Billboard from "@/components/shared/Billboard";
import Footer from "@/components/shared/layout/Footer";
import Pagination from "@/components/shared/Pagination";
import ProjectFilters from "../components/ProjectFilters";
import ProjectSearchBar from "../components/ProjectSearchBar";
import ProjectGrid from "../components/ProjectGrid";

export default function HomepageViews() {
  return (
    <>
      <div className="space-y-4 md:space-y-5 pb-10">
        <div className="flex flex-col items-center mx-auto px-4 sm:px-6 md:px-8 lg:px-0 mt-4 md:mt-8">
          <Billboard />
        </div>

        <div className="px-4 sm:px-6 md:px-8 lg:px-12 mx-auto max-w-[1200px] py-4 md:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12">
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

          {/* Grille de projets */}
          <ProjectGrid />

          {/* Pagination */}
          <div className="mt-25">
            <Pagination />
          </div>
        </div>

        <div className="mt-20 px-4 sm:px-6 md:px-8">
          <Footer />
        </div>
      </div>
    </>
  );
}
