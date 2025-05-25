import ProjectCardComponent from "@/components/shared/ProjectCard";

import { Profile } from "../types/profileTypes";

interface PinnedProjectsProps {
  profile: Profile;
}

export default function PinnedProjects({ profile }: PinnedProjectsProps) {
  if (!profile?.projects) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {profile.projects.slice(0, 3).map((project) => (
        <ProjectCardComponent
          key={project.id}
          projectId={project.id}
          title={project.name}
          description={project.description || ""}
          image={project.image || ""}
          stars={project.stargazers_count || 0}
          showViewProject={false}
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
          className="w-full max-w-[731px] bg-white"
        />
      ))}
    </div>
  );
}
