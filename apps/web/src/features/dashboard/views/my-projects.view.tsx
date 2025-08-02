"use client";

import { useEffect, useState } from "react";

import { EmptyState } from "@/shared/components/ui/empty-state";

import DashboardHeading from "../components/layout/dashboard-heading.component";
import MyProjectTabs from "../components/my-projects/my-project-tabs.component";
import MyProjectsList from "../components/my-projects/my-projects-list.component";
import { useMyProjects } from "../hooks/use-my-projects.hook";
import { ApplicationType } from "../types/my-projects.type";

export default function MyProjectsView() {
  const { data: projects = [] } = useMyProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  // Sélectionner automatiquement le premier projet par défaut
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      const firstProject = projects[0];
      if (firstProject.id) {
        setSelectedProjectId(firstProject.id);
      }
    }
  }, [projects, selectedProjectId]);

  const handleApplicationDecision = (
    applicationId: string,
    decision: "ACCEPTED" | "REJECTED",
    reason?: string
  ) => {
    // TODO: Implémenter la logique de décision
    console.log("Application decision:", { applicationId, decision, reason });
  };

  // Récupérer les applications du projet sélectionné
  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const selectedProjectApplications = selectedProject?.applications || [];

  return (
    <div>
      <DashboardHeading
        title="Mes projets"
        description="Gérez vos projets Open Source et les candidatures reçues."
      />

      {/* Layout responsive */}
      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-8">
        {/* Section Mes Projets */}
        <div className="order-1 w-full min-w-0 lg:w-[35%]">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-lg font-semibold tracking-tight lg:hidden">
              Mes Projets
            </h2>
          </div>
          <MyProjectsList
            onProjectSelect={setSelectedProjectId}
            selectedProjectId={selectedProjectId}
          />
        </div>

        {/* Section Candidatures & Équipe - Affichage conditionnel */}
        <div className="order-2 w-full min-w-0 lg:w-[65%]">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-lg font-semibold tracking-tight lg:hidden">
              Candidatures & Équipe
            </h2>
          </div>

          {selectedProjectId ? (
            <MyProjectTabs
              applications={selectedProjectApplications as ApplicationType[]}
              onApplicationDecision={handleApplicationDecision}
            />
          ) : (
            <EmptyState
              title="Sélectionnez un projet"
              description="Cliquez sur un projet pour voir ses candidatures et membres d'équipe."
            />
          )}
        </div>
      </div>
    </div>
  );
}
