"use client";

import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import Icon from "@/shared/components/ui/icon";

import ProjectDetailError from "../components/error-ui/project-detail-content-error.component";
import ProjectFilters from "../components/project-filters.component";
import ProjectHero from "../components/project-hero.component";
import ProjectSideBar from "../components/project-side-bar.component";
import RoleCard from "../components/role-card.component";
import SkeletonProjectDetail from "../components/skeletons/skeleton-project-detail.component";
import CreateRoleForm from "../forms/create-role.form";
import { useGetProjectRoles } from "../hooks/use-project-role.hook";
import { useProject } from "../hooks/use-projects.hook";

interface ProjectDetailViewProps {
  projectId: string;
}

export default function ProjectDetailView({
  projectId,
}: ProjectDetailViewProps) {
  const { data: project, isLoading, isError } = useProject(projectId);
  const { data: projectRoles, isLoading: isProjectRolesLoading } =
    useGetProjectRoles(projectId);

  // TODO: Remplacer par la vraie logique de vérification du maintainer
  const isMaintainer = true; // Variable temporaire pour le développement

  if (isLoading || isProjectRolesLoading) return <SkeletonProjectDetail />;
  if (isError || !project) return <ProjectDetailError />;

  const hasRoles = projectRoles && projectRoles.length > 0;

  return (
    <>
      <div className="mx-auto mt-12 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40"></div>
      <div className="mx-auto mt-2 mb-20 flex max-w-[1300px] flex-col gap-8 px-4 sm:px-6 md:mt-4 md:px-8 lg:px-24 xl:px-40">
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:gap-25">
          <div className="self-start lg:sticky lg:top-25 lg:pb-33">
            <ProjectSideBar project={project} isMaintainer={isMaintainer} />
          </div>
          <div className="flex w-full flex-col gap-8 lg:max-w-[668px]">
            <ProjectHero project={project} />
            <div>
              <div className="mb-3 flex items-center justify-between lg:max-w-[668px]">
                <p className="items-centers flex gap-1 text-lg font-medium tracking-tighter">
                  Rôles Disponibles{" "}
                  <span className="text-sm font-normal text-black/25">
                    {projectRoles?.length || 0}
                  </span>
                </p>
                {isMaintainer && hasRoles ? (
                  <CreateRoleForm projectId={projectId}>
                    <Button>
                      Créer un rôle
                      <Icon name="plus" size="xs" variant="white" />
                    </Button>
                  </CreateRoleForm>
                ) : !hasRoles ? (
                  <ProjectFilters
                    filters={[
                      {
                        label: "",
                        value: "Plus Récent",
                        isSortButton: true,
                      },
                    ]}
                  />
                ) : null}
              </div>
              <div className="mt-6 mb-30 flex flex-col gap-3">
                {hasRoles ? (
                  projectRoles?.map((role) => (
                    <RoleCard
                      key={role.title}
                      role={role}
                      projectGoals={project.projectGoals}
                      keyFeatures={project.keyFeatures}
                      className="mb-3 lg:max-w-[721.96px]"
                      isMaintainer={isMaintainer}
                      projectId={projectId}
                    />
                  ))
                ) : (
                  <EmptyState
                    title="Aucun Rôle Disponible"
                    description={
                      isMaintainer
                        ? "Aucun rôle n'a été soumis pour ce projet pour le moment. Les rôles apparaîtront ici une fois créés."
                        : "Ce projet n'a actuellement aucun rôle disponible. Explorez d'autres projets pour trouver des opportunités qui correspondent à vos compétences."
                    }
                    action={
                      isMaintainer ? (
                        <CreateRoleForm projectId={projectId}>
                          <Button className="flex items-center gap-2">
                            Créer un rôle
                            <Icon name="plus" size="xs" variant="white" />
                          </Button>
                        </CreateRoleForm>
                      ) : (
                        <Button
                          className="flex items-center gap-2 px-4"
                          onClick={() => (window.location.href = "/")}
                        >
                          Chercher un Projet
                          <Icon name="search" size="xs" variant="white" />
                        </Button>
                      )
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
