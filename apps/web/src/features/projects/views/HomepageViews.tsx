"use client";
import Footer from "@/components/shared/layout/Footer";
import Billboard from "@/components/shared/ui/Billboard";
import Pagination from "@/components/shared/ui/Pagination";
import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import ProjectFilters from "../components/ProjectFilters";
import ProjectSearchBar from "../components/ProjectSearchBar";
import SkeletonProjectCard from "../components/SkeletonProjectCard";
import { mockProjects } from "../data/mockProjects";

export default function HomepageViews() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Fonction pour rendre la grille de projets
  const renderProjectGrid = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {[...Array(6)].map((_, index) => (
            <SkeletonProjectCard key={index} />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {mockProjects.map((project) => (
          <ProjectCard
            key={project.id}
            projectId={project.id}
            title={project.title}
            description={project.description}
            image={project.image}
            techStack={project.techStacks
              ?.filter((tech) => typeof tech.iconUrl === "string")
              .map((tech) => ({
                icon: tech.iconUrl as string,
                alt: tech.name,
              }))}
            stars={project.communityStats?.stars || 0}
            roles={project.roles?.map((role) => ({
              name: role.title,
              color: role.badges[0]?.color || "#000000",
              bgColor: role.badges[0]?.bgColor || "#F3F3F3",
            }))}
            roleCount={project.roles?.length || 0}
          />
        ))}
      </div>
    );
  };

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
          {renderProjectGrid()}

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
