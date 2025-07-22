"use client";

import { useProjectApplications } from "@/features/projects/hooks/use-project-applications.hook";
import {
  useProject,
  useProjects,
} from "@/features/projects/hooks/use-projects.hook";

import ApplicationCard from "../components/application-card.component";

export default function DashboardView() {
  // Récupère tous les projets de l'utilisateur (on prend le premier pour la démo)
  const { data: projects, isLoading: isProjectsLoading } = useProjects();
  const project = projects?.[0];
  const projectId = project?.id;

  // Récupère les détails du projet (keyFeatures, projectGoals)
  const { data: projectDetails, isLoading: isProjectLoading } = useProject(
    projectId || ""
  );

  // Récupère les candidatures du projet
  const { data: applications, isLoading: isApplicationsLoading } =
    useProjectApplications(projectId || "");

  if (isProjectsLoading || isProjectLoading || isApplicationsLoading) {
    return <div>Chargement...</div>;
  }

  if (!projectId || !projectDetails) {
    return <div>Aucun projet trouvé.</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl font-bold">Candidatures reçues</h2>
      <h1 className="text-1xl font-normal">{projectDetails.title}</h1>
      {applications && applications.length > 0 ? (
        applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            keyFeatures={projectDetails.keyFeatures}
            projectGoals={projectDetails.projectGoals}
            // TODO: brancher onAccept/onReject sur les hooks de mutation
          />
        ))
      ) : (
        <div>Aucune candidature reçue.</div>
      )}
    </div>
  );
}
