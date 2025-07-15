"use client";

import {
  useAcceptProjectApplication,
  useProjectApplications,
  useRejectProjectApplication,
} from "@/features/projects/hooks/use-project-applications.hook";
import { Project } from "@/features/projects/types/project.type";

import ApplicationCard from "../../profile/components/application-card.component";

interface ProjectApplicationsProps {
  projects: Project[];
  userId: string;
}

export default function ProjectApplications({
  projects,
  userId,
}: ProjectApplicationsProps) {
  // Filter projects where user is the maintainer/owner
  const userProjects = projects.filter((project) => project.ownerId === userId);

  if (userProjects.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h2 className="mb-6 text-xl font-semibold tracking-tighter text-black">
        Candidatures reçues
      </h2>

      <div className="space-y-6">
        {userProjects.map((project) => (
          <ProjectApplicationsList key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

interface ProjectApplicationsListProps {
  project: Project;
}

function ProjectApplicationsList({ project }: ProjectApplicationsListProps) {
  const {
    data: applications,
    isLoading,
    isError,
  } = useProjectApplications(project.id!);

  // Mutations for accepting/rejecting applications
  const acceptMutation = useAcceptProjectApplication(project.id!);
  const rejectMutation = useRejectProjectApplication(project.id!);

  const handleAccept = (applicationId: string) => {
    acceptMutation.mutate(applicationId);
  };

  const handleReject = (applicationId: string) => {
    rejectMutation.mutate(applicationId);
  };

  const isProcessing = acceptMutation.isPending || rejectMutation.isPending;

  if (isLoading) {
    return (
      <div className="rounded-[20px] border border-[black]/5 p-6">
        <div className="animate-pulse">
          <div className="mb-4 h-6 w-48 rounded bg-gray-200"></div>
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-gray-200"></div>
            <div className="h-4 w-3/4 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !applications || applications.length === 0) {
    return null;
  }

  const pendingApplications = applications.filter(
    (app) => app.status === "PENDING"
  );
  const processedApplications = applications.filter(
    (app) => app.status !== "PENDING"
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-medium tracking-tighter text-black">
          {project.title}
        </h3>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {applications.length} candidature
          {applications.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Pending applications first */}
      {pendingApplications.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-black/70">
            En attente ({pendingApplications.length})
          </h4>
          {pendingApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              keyFeatures={project.keyFeatures}
              projectGoals={project.projectGoals}
              onAccept={handleAccept}
              onReject={handleReject}
              isProcessing={isProcessing}
            />
          ))}
        </div>
      )}

      {/* Processed applications */}
      {processedApplications.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-black/70">
            Traitées ({processedApplications.length})
          </h4>
          {processedApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              keyFeatures={project.keyFeatures}
              projectGoals={project.projectGoals}
              onAccept={handleAccept}
              onReject={handleReject}
              isProcessing={isProcessing}
            />
          ))}
        </div>
      )}
    </div>
  );
}
