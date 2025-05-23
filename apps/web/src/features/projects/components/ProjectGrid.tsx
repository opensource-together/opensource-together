import { useEffect, useState } from "react";
import { mockProjects } from "../data/mockProjects";
import ProjectCard from "@/components/shared/ProjectCard";
import SkeletonProjectCard from "./SkeletonProjectCard";

export default function ProjectGrid() {
  const [projects, setProjects] = useState<typeof mockProjects | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dans un scénario réel, ce serait un appel API
    const fetchProjects = async () => {
      try {
        // Simuler un temps de chargement pour les tests
        // Dans un cas réel, ce serait un fetch API
        setProjects(mockProjects);
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  if (isLoading || !projects) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {[...Array(6)].map((_, index) => (
          <SkeletonProjectCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          projectId={project.id}
          title={project.title}
          description={project.description}
          image={project.image}
          techStack={project.techStacks
            ?.filter((tech) => typeof tech.iconUrl === "string")
            .map((tech) => ({
              icon: tech.iconUrl as string,
              alt: tech.name,
            }))}
          stars={project.communityStats?.stars || 0}
          roles={project.roles?.map((role) => ({
            name: role.title,
            color: role.badges[0]?.color || "#000000",
            bgColor: role.badges[0]?.bgColor || "#F3F3F3",
          }))}
          roleCount={project.roles?.length || 0}
        />
      ))}
    </div>
  );
} 