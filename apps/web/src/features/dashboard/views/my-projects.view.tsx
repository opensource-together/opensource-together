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
  const [activeTab, setActiveTab] = useState<"projects" | "details">(
    "projects"
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

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    // Sur mobile, basculer vers l'onglet détails
    if (window.innerWidth < 1024) {
      setActiveTab("details");
    }
  };

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
        {/* Section Mes Projets - Desktop */}
        <div className="order-1 hidden w-full min-w-0 lg:block lg:w-[35%]">
          <MyProjectsList
            onProjectSelect={setSelectedProjectId}
            selectedProjectId={selectedProjectId}
          />
        </div>

        {/* Section Candidatures & Équipe - Desktop */}
        <div className="order-2 hidden w-full min-w-0 lg:block lg:w-[65%]">
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

        {/* Mobile: Navigation par onglets */}
        <div className="order-1 block w-full lg:hidden">
          {/* Onglets de navigation mobile */}
          <div className="mb-6 flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
                activeTab === "projects"
                  ? "border-primary text-primary border-b-2"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Mes Projets ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab("details")}
              disabled={!selectedProjectId}
              className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
                activeTab === "details"
                  ? "border-primary text-primary border-b-2"
                  : selectedProjectId
                    ? "text-gray-500 hover:text-gray-700"
                    : "cursor-not-allowed text-gray-300"
              }`}
            >
              Détails
            </button>
          </div>

          {/* Contenu des onglets */}
          {activeTab === "projects" && (
            <MyProjectsList
              onProjectSelect={handleProjectSelect}
              selectedProjectId={selectedProjectId}
            />
          )}

          {activeTab === "details" && selectedProjectId && (
            <MyProjectTabs
              applications={selectedProjectApplications as ApplicationType[]}
              onApplicationDecision={handleApplicationDecision}
            />
          )}

          {activeTab === "details" && !selectedProjectId && (
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
