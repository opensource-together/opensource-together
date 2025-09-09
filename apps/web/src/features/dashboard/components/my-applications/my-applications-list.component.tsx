"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Sheet, SheetContent } from "@/shared/components/ui/sheet";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { useMyProjectRolesApplications } from "../../hooks/use-project-role-application.hook";
import { ProjectRoleApplicationType } from "../../types/project-role-application.type";
import { MyApplicationsCard } from "./my-application-card";
import { MyApplicationDetails } from "./my-application-details";

const STATUS_TABS = [
  { label: "Toutes", value: "ALL" },
  { label: "En attente", value: "PENDING" },
  { label: "Acceptée", value: "ACCEPTED" },
  { label: "Refusée", value: "REJECTED" },
  { label: "Annulée", value: "CANCELLED" },
] as const;

function ApplicationSkeleton() {
  return (
    <div className="w-full rounded-[20px] border border-[black]/6 px-6.5 py-4 pt-7">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
    </div>
  );
}

export function MyApplicationsList() {
  const { data: applications, isLoading } = useMyProjectRolesApplications();
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedApplication, setSelectedApplication] =
    useState<ProjectRoleApplicationType | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredApplications = useMemo(() => {
    if (!applications) return [];

    return selectedStatus === "ALL"
      ? applications
      : applications.filter(
          (application: ProjectRoleApplicationType) =>
            application.status === selectedStatus
        );
  }, [applications, selectedStatus]);

  useEffect(() => {
    if (filteredApplications.length > 0) {
      setSelectedApplication(filteredApplications[0]);
    } else {
      setSelectedApplication(null);
    }
  }, [selectedStatus, filteredApplications]);

  const handleApplicationClick = (application: ProjectRoleApplicationType) => {
    setSelectedApplication(application);
    if (window.innerWidth < 640) {
      setIsDetailsOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <ApplicationSkeleton />
        <ApplicationSkeleton />
        <ApplicationSkeleton />
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <EmptyState
        title="Aucune candidature"
        description="Vous n'avez pas encore postulé à des projets."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <Button
            key={tab.value}
            onClick={() => setSelectedStatus(tab.value)}
            variant={selectedStatus === tab.value ? "default" : "outline"}
            size="sm"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <div className="w-full space-y-4 md:w-[40%]">
          {filteredApplications.length === 0 ? (
            <EmptyState
              title="Aucune candidature pour ce statut"
              description="Vous n'avez pas de candidatures correspondant à ce filtre."
            />
          ) : (
            filteredApplications.map(
              (application: ProjectRoleApplicationType) => (
                <MyApplicationsCard
                  key={application.applicationId}
                  application={application}
                  onClick={() => handleApplicationClick(application)}
                  isSelected={
                    selectedApplication?.applicationId ===
                    application.applicationId
                  }
                />
              )
            )
          )}
        </div>

        {selectedApplication && (
          <div className="hidden w-[60%] md:block">
            <MyApplicationDetails application={selectedApplication} />
          </div>
        )}

        <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <SheetContent side="bottom" className="h-[85vh] p-0">
            <div className="h-full overflow-y-auto px-6 pt-12 pb-6">
              {selectedApplication && (
                <MyApplicationDetails application={selectedApplication} />
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
