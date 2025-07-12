"use client";

import { Button } from "@/shared/components/ui/button";
import Icon from "@/shared/components/ui/icon";

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
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[350px_1fr] lg:gap-16">
          <div className="lg:contents">
            <ProjectEditForm project={project} />
          </div>

          {/* Roles Section */}
          <div className="-mt-52 flex flex-col gap-6 lg:col-start-2">
            <div className="flex items-center justify-between">
              <p className="flex gap-1 text-lg font-medium tracking-tighter">
                Rôles Disponibles
              </p>
              <CreateRoleForm projectId={project.id || ""}>
                <Button>
                  Créer un rôle
                  <Icon name="plus" size="xs" variant="white" />
                </Button>
              </CreateRoleForm>
            </div>
            <div className="mb-36 flex flex-col gap-3">
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
