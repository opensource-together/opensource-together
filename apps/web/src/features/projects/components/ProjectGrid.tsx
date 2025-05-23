import { mockProjects } from "../data/mockProjects";
import ProjectCard from "@/components/shared/ProjectCard";
import SkeletonProjectCard from "./SkeletonProjectCard";
import { useProjects } from "../hooks/useProjects";

export default function ProjectGrid() {
  // Utiliser le hook TanStack Query pour gérer les états de chargement et d'erreur
  const { data, isLoading, isError } = useProjects();
  
  // Retourne les données mockées temporairement
  // Pour une version de production, on utiliserait: const projectsData = data || mockProjects;
  // Mais ça empeche de tester l'affichage statique
  const projectsData = mockProjects;

  // Affichage des skeletons pendant le chargement
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {[...Array(6)].map((_, index) => (
          <SkeletonProjectCard key={index} />
        ))}
      </div>
    );
  }

  // Si erreur ou données chargées, on affiche les mocks
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
      {projectsData.map((project) => (
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