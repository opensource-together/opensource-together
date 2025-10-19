"use client";

import { ErrorState } from "@/shared/components/ui/error-state";

import ProjectGrid from "../components/project-grid.component";
import SkeletonProjectGrid from "../components/skeletons/skeleton-project-grid.component";
import { useProjects } from "../hooks/use-projects.hook";

export default function ProjectTrendingView() {
  const { data: projects, isError, isLoading } = useProjects();

  if (isError) {
    return (
      <ErrorState message="An error has occurred while loading the projects. Please try again later." />
    );
  }

  if (isLoading) {
    return <SkeletonProjectGrid />;
  }

  return (
    <div className="mx-6 my-20 max-w-6xl lg:mx-auto">
      <h1 className="text-start text-lg font-medium">Trending Projects</h1>
      <div className="mt-6">
        <ProjectGrid projects={projects || []} />
      </div>
    </div>
  );
}
