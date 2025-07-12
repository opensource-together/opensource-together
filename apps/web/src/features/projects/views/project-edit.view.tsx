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
    <div className="mx-auto mt-12 max-w-[1300px]">
      <div className="mx-auto mt-2 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40">
        {/* Layout Grid : sidebar | main content */}
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[350px_1fr] lg:gap-16">
          {/* ProjectEditForm va être splité via CSS */}
          <div className="lg:contents">
            <ProjectEditForm project={project} />
          </div>

          {/* Roles Section - Dans la colonne du main content */}
          <div className="mt-8 flex flex-col gap-6 lg:col-start-2">
            <div className="flex items-center justify-between">
              <p className="flex gap-1 text-lg font-medium tracking-tighter">
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
            <div className="flex flex-col gap-3">
              {project.roles?.map((role) => (
                <RoleCard
                  key={role.title}
                  role={role}
                  techStacks={project.techStacks}
                  projectGoals={project.projectGoals}
                  className="mb-3"
                  isMaintainer={true}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
