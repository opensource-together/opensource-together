import {
  useAcceptProjectRoleApplication,
  useProjectApplications,
  useRejectProjectRoleApplication,
} from "@/features/projects/hooks/use-project-applications.hook";

import ApplicationCard from "./application-card.component";

export default function ProjectApplicationsList({ project }: { project: any }) {
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
