"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import Breadcrumb from "@/components/shared/Breadcrumb";

import { mockProjects } from "../data/mockProjects";
import { useProject } from "../hooks/useProjects";
import ProjectFilters from "./ProjectFilters";
import ProjectHero from "./ProjectHero";
import ProjectSideBar from "./ProjectSideBar";
import RoleCard from "./RoleCard";
import SkeletonProjectDetail from "./SkeletonProjectDetail";

interface ProjectDetailContentProps {
  projectId: string;
}

export default function ProjectDetailContent({
  projectId,
}: ProjectDetailContentProps) {
  const [simulateLoading, setSimulateLoading] = useState(true);
  // Tanstack Query useProject hook to fetch project details by project ID
  const { data: project, isLoading, isError } = useProject(projectId);

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
        <div className="mx-auto mt-4 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40">
          <Breadcrumb
            items={[
              { label: "Accueil", href: "/" },
              { label: "Projets", href: "/projects" },
              { label: "Erreur", href: "#", isActive: true },
            ]}
          />
        </div>
        <div className="mx-auto mt-4 flex max-w-[1300px] flex-col gap-8 px-4 sm:px-6 md:mt-8 md:px-8 lg:px-24 xl:px-40">
          <div className="rounded-md bg-red-50 p-4 text-red-500">
            <h2 className="text-xl font-bold">Error loading project</h2>
            <p>
              There was an error loading the project details. Please try again
              later.
            </p>
          </div>
        </div>
      </>
    );
  }

  // Show skeleton loader while loading
  if (showLoading) {
    return (
      <>
        <div className="mx-auto mt-4 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40">
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
      <div className="mx-auto mt-1 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40">
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
      <div className="mx-auto mt-2 flex max-w-[1300px] flex-col gap-8 px-4 sm:px-6 md:mt-4 md:px-8 lg:px-24 xl:px-40">
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:gap-16">
          <div className="w-full lg:max-w-[721.96px]">
            <ProjectHero
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
          <div className="mb-3 flex items-center justify-between lg:max-w-[721.96px]">
            <p className="items-centers flex gap-1 text-xl font-medium">
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
          <div className="mt-6 mb-30 flex flex-col gap-3">
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
