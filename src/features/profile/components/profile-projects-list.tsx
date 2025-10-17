import { HiMiniSquare2Stack } from "react-icons/hi2";

import ProjectCardComponent from "@/shared/components/shared/ProjectCard";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";

import { useMyProjects } from "@/features/dashboard/hooks/use-my-projects.hook";

export default function ProfileProjectsList() {
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

  return (
    <div className="flex flex-col gap-6">
      {myProjects.map((project) => (
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
          projectStats={{
            forks: 0,
            contributors: [],
            stars: 0,
            watchers: 0,
            openIssues: 0,
            commits: 0,
            lastCommit: {
              sha: "",
              message: "",
              date: "",
              url: "",
              author: { login: "", avatar_url: "", html_url: "" },
            },
          }}
          className="w-full"
        />
      ))}
    </div>
  );
}
