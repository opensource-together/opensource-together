import ProjectCardComponent from "@/components/shared/ProjectCard";

import { Profile } from "../types/profileTypes";

interface PinnedProjectsProps {
  profile: Profile;
}

export default function PinnedProjects({ profile }: PinnedProjectsProps) {
  const { projects } = profile;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="mb-5 gap-1 text-left text-xl font-medium">
        Projets Rejoints
      </h2>
      {projects?.slice(0, 3).map((project) => (
        <ProjectCardComponent
          key={project.id}
          projectId={project.id}
          title={project.name}
          description={project.description || ""}
          image={project.image || ""}
          stars={project.stargazers_count || 0}
          showViewProject={true}
          roles={
            project.techStacks?.map((tech) => ({
              name: tech.name,
              color: "#000000",
              bgColor: "#FFFFFF",
            })) ?? []
          }
          roleCount={project.techStacks?.length ?? 0}
          techStack={
            project.techStacks?.map((tech) => ({
              icon: tech.iconUrl,
              alt: tech.name,
            })) ?? []
          }
          communityStats={{
            forks: project.forks_count || 0,
            contributors: project.watchers_count || 0,
            stars: project.stargazers_count || 0,
          }}
          authorName={project.full_name.split("/")[0] || "Unknown"}
          className="w-full max-w-[731px] bg-white"
        />
      ))}
    </div>
  );
}
