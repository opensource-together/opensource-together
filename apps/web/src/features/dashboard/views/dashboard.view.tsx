"use client";

import useAuth from "@/features/auth/hooks/use-auth.hook";
import {
  useAcceptProjectRoleApplication,
  useProjectApplications,
  useRejectProjectRoleApplication,
} from "@/features/projects/hooks/use-project-applications.hook";
import { useProjects } from "@/features/projects/hooks/use-projects.hook";

import ApplicationCard from "../components/application-card.component";

function ProjectApplicationsList({ project }: { project: any }) {
  const { data: applications, isLoading } = useProjectApplications(project.id);
  const acceptMutation = useAcceptProjectRoleApplication(project.id);
  const rejectMutation = useRejectProjectRoleApplication(project.id);

  if (isLoading) return <div>Chargement des candidatures...</div>;
  if (!applications || applications.length === 0)
    return <div>Aucune candidature reçue.</div>;

  return (
    <div className="space-y-4">
      {applications.map((application: any) => (
        <ApplicationCard
          key={application.id}
          application={application}
          keyFeatures={project.keyFeatures}
          projectGoals={project.projectGoals}
          onAccept={() => acceptMutation.mutate(application.id)}
          onReject={() => rejectMutation.mutate(application.id)}
          isProcessing={acceptMutation.isPending || rejectMutation.isPending}
        />
      ))}
    </div>
  );
}

export default function DashboardView() {
  const { data: projects, isLoading: isProjectsLoading } = useProjects();
  const { currentUser, isLoading: isUserLoading } = useAuth();

  if (isProjectsLoading || isUserLoading) {
    return <div>Chargement...</div>;
  }

  if (!projects || projects.length === 0) {
    return <div>Aucun projet trouvé.</div>;
  }

  // Filtrer les projets dont l'utilisateur courant est owner
  const userProjects = projects.filter((project) => {
    const ownerId = project.ownerId || project.author?.ownerId;
    return currentUser && ownerId && currentUser.id === ownerId;
  });

  if (userProjects.length === 0) {
    return <div>Vous n'avez aucun projet dont vous êtes le créateur.</div>;
  }

  return (
    <div className="flex flex-col gap-12">
      <h2 className="text-2xl font-bold">Candidatures reçues</h2>
      {userProjects.map((project) => (
        <div key={project.id} className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold">{project.title}</h3>
          <ProjectApplicationsList project={project} />
        </div>
      ))}
    </div>
  );
}
