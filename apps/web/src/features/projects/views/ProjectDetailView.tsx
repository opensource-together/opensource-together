"use client";

import Breadcrumb from "@/components/shared/Breadcrumb";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProjectFilters from "../components/ProjectFilters";
import ProjectPageCard from "../components/ProjectPageCard";
import ProjectSideBar from "../components/ProjectSideBar";
import RoleCard from "../components/RoleCard";
import SkeletonProjectDetail from "../components/SkeletonProjectDetail";
import { mockProjects } from "../data/mockProjects";
import { useProject } from "../hooks/useProjects";

interface ProjectDetailViewProps {
  projectId: string;
}

export default function ProjectDetailView({
  projectId,
}: ProjectDetailViewProps) {
  const [simulateLoading, setSimulateLoading] = useState(true);
  // Tanstack Query useProject hook to fetch project details by project ID
  const { data: project, isLoading, isError, error } = useProject(projectId);

  // Fallback to mock data if project is not found
  const projectData = project || mockProjects.find((p) => p.id === projectId);

  // This simulates loading for skeleton loaders even when data is cached
  useEffect(() => {
    const timer = setTimeout(() => setSimulateLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Determine if we show loading state (either real API loading or simulated loading)
  const showLoading = isLoading || simulateLoading;

  // Handle error state
  if (isError && !showLoading && !projectData) {
    return (
      <>
        <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-4">
          <Breadcrumb
            items={[
              { label: "Accueil", href: "/" },
              { label: "Projets", href: "/projects" },
              { label: "Erreur", href: "#", isActive: true },
            ]}
          />
        </div>
        <div className="flex flex-col mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-4 md:mt-8 gap-8">
          <div className="text-red-500 p-4 rounded-md bg-red-50">
            <h2 className="text-xl font-bold">Error loading project</h2>
            <p>
              There was an error loading the project details. Please try again
              later.
            </p>
            {process.env.NODE_ENV !== "production" &&
              error instanceof Error && (
                <p className="mt-2 text-sm font-mono">{error.message}</p>
              )}
          </div>
        </div>
      </>
    );
  }

  // Show skeleton loader while loading
  if (showLoading) {
    return (
      <>
        <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-4">
          <Breadcrumb
            items={[
              { label: "Accueil", href: "/" },
              { label: "Projets", href: "/projects" },
              { label: "Chargement...", href: "#", isActive: true },
            ]}
          />
        </div>
        <SkeletonProjectDetail />
      </>
    );
  }

  return (
    <>
      <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-1">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Projets", href: "/projects" },
            {
              label: projectData?.title || "Projet",
              href: "#",
              isActive: true,
            },
          ]}
        />
      </div>
      <div className="flex flex-col mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-2 md:mt-4 gap-8">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-16">
          <div className="lg:max-w-[721.96px] w-full">
            <ProjectPageCard
              title={projectData?.title}
              description={projectData?.description}
              longDescription={projectData?.longDescription}
              techStacks={projectData?.techStacks}
              keyBenefits={projectData?.keyBenefits}
              image={projectData?.image}
              authorName={projectData?.authorName}
              authorImage={projectData?.authorImage}
            />
          </div>
          <ProjectSideBar
            socialLinks={projectData?.socialLinks}
            communityStats={{
              stars: projectData?.communityStats?.stars || 0,
              contributors: projectData?.communityStats?.contributors || 0,
              forks: projectData?.communityStats?.forks || 0,
            }}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-3 lg:max-w-[721.96px]">
            <p className="text-[20px] font-medium font-geist flex items-centers gap-1">
              Rôles Disponibles{" "}
              <Image
                src="/icons/people.svg"
                className="mt-1"
                alt="peopleicon"
                width={14}
                height={14}
              />{" "}
            </p>
            <ProjectFilters
              filters={[
                { label: "", value: "Plus Récent", isSortButton: true },
              ]}
            />
          </div>
          <div className="flex flex-col gap-3 mt-6 mb-30">
            {projectData?.roles &&
              projectData.roles.length > 0 &&
              projectData.roles.map((role) => (
                <RoleCard
                  key={role.id}
                  title={role.title}
                  description={role.description}
                  badges={role.badges}
                  className="mb-3 lg:max-w-[721.96px]"
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
