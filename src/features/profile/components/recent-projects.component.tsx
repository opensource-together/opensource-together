import Link from "next/link";
import { HiMiniSquare2Stack } from "react-icons/hi2";

import ProjectCardComponent from "@/shared/components/shared/ProjectCard";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";

import { useMyProjects } from "@/features/dashboard/hooks/use-my-projects.hook";

export default function RecentProjects() {
  const { data: myProjects = [], isLoading, isError } = useMyProjects();

  if (isLoading) return <div>loading</div>;
  if (isError)
    return (
      <ErrorState
        message="Failed to fetch projects"
        queryKey={["user", "me", "projects"]}
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
        <ProjectCardComponent
          key={project.id}
          projectId={project.id}
          title={project.title}
          description={project.description}
          logoUrl={project.logoUrl || ""}
          projectTechStacks={project.projectTechStacks}
          owner={{
            id: project.owner?.id || "",
            name: project.owner?.name || "",
          }}
          repositoryDetails={{
            stars: project.repositoryDetails?.stars || 0,
            contributors: project.repositoryDetails?.contributors || [],
            forksCount: project.repositoryDetails?.forksCount || 0,
            openIssuesCount: project.repositoryDetails?.openIssuesCount || 0,
            pullRequestsCount:
              project.repositoryDetails?.pullRequestsCount || 0,
          }}
          className="w-full"
        />
      ))}
    </div>
  );
}
