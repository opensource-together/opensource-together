"use client";

import peopleicon from "@/components/shared/icons/people.svg";
import Breadcrumb from "@/components/shared/ui/Breadcrumb";
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
            showForks={true}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-3 lg:max-w-[721.96px]">
            <p className="text-[20px] font-medium font-geist flex items-centers gap-1">
              Rôles Disponibles{" "}
              <Image
                src={peopleicon}
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
            {projectData?.roles && projectData.roles.length > 0 ? (
              projectData.roles.map((role) => (
                <RoleCard
                  key={role.id}
                  title={role.title}
                  description={role.description}
                  badges={role.badges}
                  experienceBadge={role.experienceBadge}
                />
              ))
            ) : (
              // Default role cards if none are provided
              <>
                <RoleCard
                  title="Developeur Backend"
                  description="Nous recrutons un Developeur Backend pour construire des systèmes et API robustes et évolutifs côté serveur. Vous collaborerez avec des équipes interfonctionnelles pour livrer des systèmes backends fiables en utilisant des technologies comme [ Node.js, Python, SQL, etc.]."
                  badges={[
                    { label: "MongoDB", color: "#00D5BE", bgColor: "#CBFBF1" },
                    { label: "MongoDB", color: "#00D5BE", bgColor: "#CBFBF1" },
                    { label: "MongoDB", color: "#00D5BE", bgColor: "#CBFBF1" },
                  ]}
                  experienceBadge="+3 Ans d'expérience"
                />
                <RoleCard
                  title="Designer UX"
                  description="Nous recrutons un Designer UX pour créer des expériences utilisateur intuitives et centrées sur l'utilisateur sur les plateformes web et mobiles. Vous collaborerez avec les équipes de produit et de développement pour transformer les insights en wireframes, prototypes et parcours utilisateur fluides."
                  badges={[
                    { label: "Design", color: "#FDA5D5", bgColor: "#FDF2F8" },
                  ]}
                  experienceBadge="+2 Ans d'expérience"
                />
                <RoleCard
                  title="Developeur Frontend"
                  description="Nous recrutons un Developeur Frontend pour construire des interfaces utilisateur réactives et de haute qualité en utilisant les technologies web modernes. Vous serez responsable de la transformation des concepts de design en expériences numériques rapides, accessibles et interactives."
                  badges={[
                    { label: "React", color: "#00BCFF", bgColor: "#DFF2FE" },
                  ]}
                  experienceBadge="+1 An d'expérience"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
