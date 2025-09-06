"use client";

import { useEffect, useState } from "react";
import { HiMiniSquare2Stack } from "react-icons/hi2";

import { Separator } from "@/shared/components/ui/separator";

import useAuth from "@/features/auth/hooks/use-auth.hook";

import DashboardCtaComponent from "../components/layout/dashboard-cta.component";
import DashboardHeading from "../components/layout/dashboard-heading.component";
import MyProjectsList from "../components/my-projects/my-projects-list.component";
import MyProjectsSkeletonComponent from "../components/skeletons/my-projects-skeleton.component";
import { useMyProjects } from "../hooks/use-my-projects.hook";
import {
  useAcceptProjectRoleApplication,
  useRejectProjectRoleApplication,
} from "../hooks/use-project-role-application.hook";

export default function MyProjectsView() {
  const { data: projects = [], isLoading } = useMyProjects();
  const { currentUser } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"projects" | "details">(
    "projects"
  );

  const acceptApplicationMutation = useAcceptProjectRoleApplication();
  const rejectApplicationMutation = useRejectProjectRoleApplication();

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
    if (window.innerWidth < 1024) {
      setActiveTab("details");
    }
  };

  const handleApplicationDecision = (
    applicationId: string,
    decision: "ACCEPTED" | "REJECTED"
  ) => {
    if (decision === "ACCEPTED") {
      acceptApplicationMutation.acceptApplication(applicationId);
    } else {
      rejectApplicationMutation.rejectApplication(applicationId);
    }
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const selectedProjectApplications =
    selectedProject?.applications.filter((app) => app.status !== "CANCELLED") ||
    [];
  const selectedProjectTeamMembers = selectedProject?.teamMembers || [];

  if (isLoading) return <MyProjectsSkeletonComponent />;

  return (
    <div>
      <DashboardHeading
        title="Projets"
        icon={<HiMiniSquare2Stack size={16} />}
        description="Organisez, modifiez, gérez les membres et administrez vos projets — tout en un seul endroit."
      />
      <DashboardCtaComponent />

      <Separator className="my-10" />

      <div className="w-full">
        <MyProjectsList />

        {/* <div className="order-2 hidden w-full min-w-0 lg:block lg:w-[65%]">
          {selectedProjectId ? (
            <MyProjectTabs
              applications={selectedProjectApplications as ApplicationType[]}
              teamMembers={selectedProjectTeamMembers}
              onApplicationDecision={handleApplicationDecision}
              projectOwnerId={selectedProject?.owner.id}
              currentUserId={currentUser?.id}
              projectOwner={selectedProject?.owner}
            />
          ) : (
            <EmptyState
              title="Sélectionnez un projet"
              description="Cliquez sur un projet pour voir ses candidatures et membres d'équipe."
            />
          )}
        </div>

        <div className="order-1 block w-full lg:hidden">
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

          {activeTab === "projects" && (
            <MyProjectsList
              onProjectSelect={handleProjectSelect}
              selectedProjectId={selectedProjectId}
            />
          )}

          {activeTab === "details" && selectedProjectId && (
            <MyProjectTabs
              applications={selectedProjectApplications as ApplicationType[]}
              teamMembers={selectedProjectTeamMembers}
              onApplicationDecision={handleApplicationDecision}
              projectOwnerId={selectedProject?.owner.id}
              currentUserId={currentUser?.id}
              projectOwner={selectedProject?.owner}
            />
          )}

          {activeTab === "details" && !selectedProjectId && (
            <EmptyState
              title="Sélectionnez un projet"
              description="Cliquez sur un projet pour voir ses candidatures et membres d'équipe."
            />
          )}
        </div> */}
      </div>
    </div>
  );
}
