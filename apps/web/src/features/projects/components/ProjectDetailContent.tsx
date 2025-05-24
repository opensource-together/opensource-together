"use client";

import Image from "next/image";

import Breadcrumb from "@/components/shared/Breadcrumb";

import { useProject } from "../hooks/useProjects";
import ProjectFilters from "./ProjectFilters";
import ProjectHero from "./ProjectHero";
import ProjectSideBar from "./ProjectSideBar";
import RoleCard from "./RoleCard";
import ProjectDetailContentError from "./error-ui/ProjectDetailContentError";
import SkeletonProjectDetailContent from "./skeletons/SkeletonProjectDetailContent";

interface ProjectDetailContentProps {
  projectId: string;
}

export default function ProjectDetailContent({
  projectId,
}: ProjectDetailContentProps) {
  const { data: project, isLoading, isError } = useProject(projectId);

  if (isError) return <ProjectDetailContentError />;
  if (isLoading) return <SkeletonProjectDetailContent />;

  return (
    <>
      <div className="mx-auto mt-1 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Projets", href: "/projects" },
            {
              label: project?.title || "Projet",
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
              title={project?.title}
              description={project?.description}
              longDescription={project?.longDescription}
              techStacks={project?.techStacks}
              keyBenefits={project?.keyBenefits}
              image={project?.image}
              authorName={project?.authorName}
              authorImage={project?.authorImage}
            />
          </div>
          <ProjectSideBar
            socialLinks={project?.socialLinks}
            communityStats={{
              stars: project?.communityStats?.stars || 0,
              contributors: project?.communityStats?.contributors || 0,
              forks: project?.communityStats?.forks || 0,
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
            {project?.roles &&
              project.roles.length > 0 &&
              project.roles.map((role) => (
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
