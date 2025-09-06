"use client";

import useAuth from "@/features/auth/hooks/use-auth.hook";

import MyProjectDetailsHeadingComponent from "../../components/my-projects/my-project-details-heading.component";
import MyProjectTabs from "../../components/my-projects/my-project-tabs.component";
import { useMyProjectDetails } from "../../hooks/use-my-projects.hook";

interface MyProjectDetailsViewProps {
  projectId: string;
}

export default function MyProjectDetailsView({
  projectId,
}: MyProjectDetailsViewProps) {
  const { data: project, isLoading } = useMyProjectDetails(projectId);
  const { currentUser } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div>
      <MyProjectDetailsHeadingComponent project={project} />
      <div className="my-8"></div>
      <MyProjectTabs
        projectId={projectId}
        applications={project.applications}
        teamMembers={project.teamMembers}
        projectOwnerId={project.owner.id}
        currentUserId={currentUser?.id}
      />
    </div>
  );
}
