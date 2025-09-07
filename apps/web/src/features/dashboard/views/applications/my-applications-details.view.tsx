"use client";

import { EmptyState } from "@/shared/components/ui/empty-state";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { MyApplicationDetails } from "../../components/my-applications/my-application-details.component";
import { useMyProjectRolesApplications } from "../../hooks/use-project-role-application.hook";

interface MyApplicationsDetailsViewProps {
  applicationId: string;
}

export default function MyApplicationsDetailsView({
  applicationId,
}: MyApplicationsDetailsViewProps) {
  const { data: applications, isLoading } = useMyProjectRolesApplications();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!applications) {
    return (
      <EmptyState
        title="Erreur de chargement"
        description="Impossible de charger vos candidatures."
      />
    );
  }

  const application = applications.find(
    (app) => app.applicationId === applicationId
  );

  if (!application) {
    return (
      <EmptyState
        title="Candidature introuvable"
        description="Cette candidature n'existe pas ou vous n'y avez pas accès."
      />
    );
  }

  return <MyApplicationDetails application={application} />;
}
