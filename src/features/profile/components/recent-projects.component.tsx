import Link from "next/link";
import { HiMiniSquare2Stack } from "react-icons/hi2";

import ProjectCardComponent from "@/shared/components/shared/ProjectCard";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import { useProjectRepositorySummary } from "@/shared/hooks/use-git-repo-summary.hook";

import type { Project } from "@/features/projects/types/project.type";

import { useUserProjects } from "../hooks/use-profile.hook";
import ProfileProjectsSkeleton from "./skeletons/profile-projects-skeleton.component";

function RecentProjectItem({ project }: { project: Project }) {
  const { data: repoSummary, isLoading } = useProjectRepositorySummary(
    project.publicId || project.id
  );

  const repositoryDetails = {
    languages:
      repoSummary?.languages ?? project.repositoryDetails?.languages ?? {},
    forksCount:
      repoSummary?.forksCount ?? project.repositoryDetails?.forksCount ?? 0,
    stars: repoSummary?.stars ?? project.repositoryDetails?.stars ?? 0,
    openIssuesCount:
      repoSummary?.openIssuesCount ??
      project.repositoryDetails?.openIssuesCount ??
      0,
  };

  return (
    <ProjectCardComponent
      key={project.id}
      projectId={project.id}
      title={project.title}
      description={project.description}
      logoUrl={project.logoUrl || ""}
      projectTechStacks={project.projectTechStacks}
      repoUrl={project.repoUrl || ""}
      repositoryDetails={repositoryDetails}
      isRepositoryLoading={isLoading}
      className="w-full"
    />
  );
}

interface RecentProjectsProps {
  userId?: string;
}

export default function RecentProjects({ userId }: RecentProjectsProps) {
  // If userId is provided, use the user's projects endpoint, otherwise use "me"
  const effectiveUserId = userId || "me";

  const {
    data: projectsResponse,
    isLoading,
    isError,
  } = useUserProjects(
    effectiveUserId,
    {
      page: 1,
      per_page: 3,
      published: true,
    },
    { enabled: !!effectiveUserId }
  );
  const myProjects = projectsResponse?.data || [];

  if (isLoading) return <ProfileProjectsSkeleton />;
  if (isError)
    return (
      <ErrorState
        message="Failed to fetch projects"
        queryKey={["users", effectiveUserId, "projects"]}
      />
    );

  if (myProjects.length === 0)
    return (
      <EmptyState
        title="No projects"
        description="No projects have been joined yet"
        icon={HiMiniSquare2Stack}
      />
    );

  const recentProjects = myProjects.slice(0, 3);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="mt-14 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="bg-ost-blue-three flex size-1.5 rounded-full"></span>
          <h2 className="text-muted-foreground">
            <span className="text-primary font-medium">
              {recentProjects.length}
            </span>{" "}
            {recentProjects.length === 1 ? "Recent Project" : "Recent Projects"}
          </h2>
        </div>
        <Link href="?tab=projects">
          <Button variant="outline">View All Projects</Button>
        </Link>
      </div>
      {recentProjects.map((project) => (
        <RecentProjectItem key={project.id} project={project} />
      ))}
    </div>
  );
}
