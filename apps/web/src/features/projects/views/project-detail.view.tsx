"use client";

import { Button } from "@/shared/components/ui/button";
import Icon from "@/shared/components/ui/icon";

import ProjectDetailError from "../components/error-ui/project-detail-content-error.component";
import ProjectFilters from "../components/project-filters.component";
import ProjectHero from "../components/project-hero.component";
import ProjectSideBar from "../components/project-side-bar.component";
import RoleCard from "../components/role-card.component";
import SkeletonProjectDetail from "../components/skeletons/skeleton-project-detail.component";
import CreateRoleForm from "../forms/create-role.form";
import { useProject } from "../hooks/use-projects.hook";

interface ProjectDetailViewProps {
  projectId: string;
}

export default function ProjectDetailView({
  projectId,
}: ProjectDetailViewProps) {
  const { data: project, isLoading, isError } = useProject(projectId);

  // TODO: Remplacer par la vraie logique de vérification du maintainer
  const isMaintainer = true; // Variable temporaire pour le développement

  if (isLoading) return <SkeletonProjectDetail />;
  if (isError || !project) return <ProjectDetailError />;

  return (
    <>
      <div className="mx-auto mt-12 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40"></div>
      <div className="mx-auto mt-2 flex max-w-[1300px] flex-col gap-8 px-4 sm:px-6 md:mt-4 md:px-8 lg:px-24 xl:px-40">
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:gap-16">
          <div className="self-start lg:sticky lg:top-[100px] lg:pb-33">
            <ProjectSideBar project={project} isMaintainer={isMaintainer} />
          </div>
          <div className="flex w-full flex-col gap-8 lg:max-w-[668px]">
            <ProjectHero project={project} />
            <div>
              <div className="mb-3 flex items-center justify-between lg:max-w-[668px]">
                <p className="items-centers flex gap-1 text-lg font-medium tracking-tighter">
                  Rôles Disponibles
                </p>
                {isMaintainer ? (
                  <CreateRoleForm projectId={projectId}>
                    <Button>
                      Créer un rôle
                      <Icon name="plus" size="xs" variant="white" />
                    </Button>
                  </CreateRoleForm>
                ) : (
                  <ProjectFilters
                    filters={[
                      {
                        label: "",
                        value: "Plus Récent",
                        isSortButton: true,
                      },
                    ]}
                  />
                )}
              </div>
              <div className="mt-6 mb-30 flex flex-col gap-3">
                {project.roles?.map((role) => (
                  <RoleCard
                    key={role.title}
                    role={role}
                    techStacks={project.techStacks}
                    projectGoals={project.projectGoals}
                    className="mb-3 lg:max-w-[721.96px]"
                    isMaintainer={isMaintainer}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
