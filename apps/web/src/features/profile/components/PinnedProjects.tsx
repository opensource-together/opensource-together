"use client";
import ProjectCardComponent from "@/components/shared/ProjectCard";
import { mockProjects } from "../../projects/data/mockProjects";

export default function PinnedProjects() {
  return (
    <div className="flex flex-col gap-4">
      {mockProjects.slice(0, 3).map((project) => (
        <ProjectCardComponent
          key={project.id}
          projectId={project.id}
          title={project.title}
          description={project.description}
          image={project.image}
          stars={project.communityStats?.stars ?? 0}
          showViewProject={false}
          roles={
            project.roles?.map((role) => ({
              name: role.title,
              // Conversion des badges vers le format attendu par le composant
              color: role.badges[0]?.color ?? "#000000",
              bgColor: role.badges[0]?.bgColor ?? "#FFFFFF",
            })) ?? []
          }
          roleCount={project.roles?.length ?? 0}
          techStack={
            project.techStacks?.map((tech) => ({
              icon: tech.iconUrl ?? "",
              alt: tech.name,
            })) ?? []
          }
          className="bg-white w-full max-w-[731px]"
        />
      ))}
    </div>
  );
}
