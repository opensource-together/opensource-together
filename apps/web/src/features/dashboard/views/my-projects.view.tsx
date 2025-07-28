"use client";

import { EmptyState } from "@/shared/components/ui/empty-state";

import DashboardHeading from "../components/layout/dashboard-heading.component";
import MyApplicationsReceived from "../components/my-projects/my-applications-received.component";
import MyProjectsList from "../components/my-projects/my-projects-list.component";
import { useApplicationsReceived } from "../hooks/use-applications-received.hook";

export default function MyProjectsView() {
  const { data: allApplications = [] } = useApplicationsReceived();

  const handleApplicationDecision = () => {};

  return (
    <div>
      <DashboardHeading
        title="Mes projets"
        description="Gérez vos projets Open Source et les candidatures reçues."
      />
      <div className="mt-8 flex gap-8">
        {/* Section Mes Projets */}
        <div className="w-[35%]min-w-0">
          <MyProjectsList />
        </div>

        {/* Section Candidatures récentes */}
        <div className="w-[65%] min-w-0">
          {allApplications.length > 0 ? (
            <MyApplicationsReceived
              applications={allApplications}
              onApplicationDecision={handleApplicationDecision}
            />
          ) : (
            <EmptyState
              title="Aucune candidature"
              description="Aucune candidature reçue pour le moment."
            />
          )}
        </div>
      </div>
    </div>
  );
}
