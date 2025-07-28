"use client";

import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Icon } from "@/shared/components/ui/icon";

import { useMyProjects } from "../../hooks/use-my-projects.hook";
import MyProjectsCard from "./my-projects-card.component";

interface MyProjectsListProps {
  onProjectSelect?: (projectId: string) => void;
  selectedProjectId?: string | null;
}

export default function MyProjectsList({
  onProjectSelect,
  selectedProjectId,
}: MyProjectsListProps) {
  const { data: projects = [], isLoading: isLoadingProjects } = useMyProjects();

  if (isLoadingProjects) {
    return (
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 rounded-[20px] bg-gray-200"></div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        title="Aucun projet"
        description="Vous n'avez pas de projets. Créez un projet pour commencer."
        action={
          <Link href="/projects/create">
            <Button>
              Créer un projet
              <Icon name="arrow-up-right" variant="white" size="xs" />
            </Button>
          </Link>
        }
      />
    );
  }

  const handleProjectClick = (projectId: string) => {
    onProjectSelect?.(projectId);
  };

  return (
    <div className="space-y-3">
      {projects.map(
        (project) =>
          project.id && (
            <MyProjectsCard
              key={project.id}
              project={project}
              isSelected={selectedProjectId === project.id}
              onClick={() => handleProjectClick(project.id!)}
            />
          )
      )}
    </div>
  );
}
