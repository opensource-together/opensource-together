"use client";

import Image from "next/image";

import ProjectFilters from "../components/ProjectFilters";
import ProjectHero from "../components/ProjectHero";
import ProjectLatestUpdate from "../components/ProjectLatestUpdate";
import ProjectReadMe from "../components/ProjectReadMe";
import ProjectSideBar from "../components/ProjectSideBar";
import RoleCard from "../components/RoleCard";
import ProjectDetailError from "../components/error-ui/ProjectDetailContentError";
import SkeletonProjectDetailView from "../components/skeletons/SkeletonProjectDetailView";
import { useProject } from "../hooks/useProjects";

interface ProjectDetailViewProps {
  projectId: string;
}

export default function ProjectDetailView({
  projectId,
}: ProjectDetailViewProps) {
  const { data: project, isLoading, isError } = useProject(projectId);

  if (isLoading) return <SkeletonProjectDetailView />;
  if (isError || !project) return <ProjectDetailError />;

  return (
    <>
      <div className="mx-auto mt-1 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40"></div>
      <div className="mx-auto mt-2 flex max-w-[1300px] flex-col gap-8 px-4 sm:px-6 md:mt-4 md:px-8 lg:px-24 xl:px-40">
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:gap-16">
          <ProjectSideBar project={project} />
          <div className="w-full lg:max-w-[721.96px]">
            <ProjectHero project={project} />
          </div>
        </div>
        <ProjectReadMe />
        <ProjectLatestUpdate />
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
            {project.roles?.map((role) => (
              <RoleCard
                key={role.title}
                role={role}
                className="mb-3 lg:max-w-[721.96px]"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
