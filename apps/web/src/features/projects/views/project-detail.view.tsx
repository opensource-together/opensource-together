"use client";

import { IoEllipse } from "react-icons/io5";

import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import Icon from "@/shared/components/ui/icon";

import useAuth from "@/features/auth/hooks/use-auth.hook";

import ProjectDetailContentError from "../components/error-ui/project-detail-content-error.component";
import ProjectFilters from "../components/project-filters.component";
import ProjectHero, {
  ProjectMobileHero,
} from "../components/project-hero.component";
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
  const { currentUser, isLoading: isAuthLoading } = useAuth();

  const isMaintainer = !isAuthLoading && currentUser?.id === project?.owner?.id;

  if (isLoading || isProjectRolesLoading) return <SkeletonProjectDetail />;
  if (isError || !project) return <ProjectDetailContentError />;

  const hasRoles = projectRoles && projectRoles.length > 0;

  return (
    <TwoColumnLayout
      sidebar={
        <ProjectSideBar
          project={project}
          isMaintainer={isMaintainer}
          isAuthLoading={isAuthLoading}
        />
      }
      hero={<ProjectHero project={project} />}
      mobileHeader={<ProjectMobileHero {...project} />}
    >
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="flex items-center gap-1 text-sm font-medium">
            <IoEllipse className="text-ost-blue-three size-2" />
            {projectRoles?.length || 0}{" "}
            <span className="text-muted-foreground font-medium">
              {(projectRoles?.length || 0) > 1
                ? "Rôles Disponibles"
                : "Rôle Disponible"}
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
    </TwoColumnLayout>
  );
}
