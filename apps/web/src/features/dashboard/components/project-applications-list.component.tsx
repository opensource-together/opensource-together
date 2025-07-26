"use client";

import {
  useAcceptProjectRoleApplication,
  useProjectRolesApplications,
  useRejectProjectRoleApplication,
} from "../hooks/use-project-role-application.hook";
import { ProjectRoleApplicationType } from "../types/project-role-application.type";
import ApplicationCard from "./application-card.component";

export default function ProjectApplicationsList({
  projectId,
}: {
  projectId: string;
}) {
  const { data: applications, isLoading } =
    useProjectRolesApplications(projectId);
  const acceptMutation = useAcceptProjectRoleApplication(projectId);
  const rejectMutation = useRejectProjectRoleApplication(projectId);

  if (isLoading) return <div>Chargement des candidatures...</div>;
  if (!applications || applications.length === 0)
    return <div>Aucune candidature reçue.</div>;

  return (
    <div className="space-y-4">
      {applications.map((application: ProjectRoleApplicationType) => (
        <ApplicationCard
          key={application.appplicationId}
          keyFeatures={[]}
          projectGoals={[]}
          onAccept={() => acceptMutation.mutate(application.appplicationId)}
          onReject={() => rejectMutation.mutate(application.appplicationId)}
          isProcessing={acceptMutation.isPending || rejectMutation.isPending}
        />
      ))}
    </div>
  );
}
