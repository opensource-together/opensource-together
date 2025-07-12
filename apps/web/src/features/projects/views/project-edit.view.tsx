"use client";

import Image from "next/image";

import { Button } from "@/shared/components/ui/button";

import ProjectDetailError from "../components/error-ui/project-detail-content-error.component";
import RoleCard from "../components/role-card.component";
import SkeletonProjectDetail from "../components/skeletons/skeleton-project-detail.component";
import CreateRoleForm from "../forms/create-role.form";
import ProjectEditForm from "../forms/project-edit.form";
import { useProject } from "../hooks/use-projects.hook";

export default function ProjectEditView({ projectId }: { projectId: string }) {
  const { data: project, isLoading, isError } = useProject(projectId);

  if (isLoading) return <SkeletonProjectDetail />;
  if (isError || !project) return <ProjectDetailError />;

  return (
    <>
      <div className="mx-auto mt-12 max-w-[1300px]">
        <div className="mx-auto mt-2 flex max-w-[1300px] flex-col gap-8 px-4 sm:px-6 md:mt-4 md:px-8 lg:px-24 xl:px-40">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:gap-16">
            <ProjectEditForm project={project} />
          </div>
          {/* Roles Section */}
          <div className="flex flex-col justify-end gap-8 lg:max-w-2xl">
            <div className="my-3 flex items-center justify-between lg:max-w-[668px]">
              <p className="items-centers flex gap-1 text-lg font-medium tracking-tighter">
                Rôles Disponibles
              </p>
              <CreateRoleForm projectId={project.id || ""}>
                <Button>
                  Créer un rôle
                  <Image
                    src="/icons/plus-white.svg"
                    alt="plus"
                    width={12}
                    height={12}
                  />
                </Button>
              </CreateRoleForm>
            </div>
            <div className="mt-6 mb-30 flex flex-col gap-3">
              {project.roles?.map((role) => (
                <RoleCard
                  key={role.title}
                  role={role}
                  techStacks={project.techStacks}
                  projectGoals={project.projectGoals}
                  className="mb-3 lg:max-w-[721.96px]"
                  isMaintainer={true}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
