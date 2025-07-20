"use client";

import ProjectDetailError from "../components/error-ui/project-detail-content-error.component";
import SkeletonProjectDetail from "../components/skeletons/skeleton-project-detail.component";
import ProjectEditForm from "../forms/project-edit.form";
import { useProject } from "../hooks/use-projects.hook";

export default function ProjectEditView({ projectId }: { projectId: string }) {
  const { data: project, isLoading, isError } = useProject(projectId);

  if (isLoading) return <SkeletonProjectDetail />;
  if (isError || !project) return <ProjectDetailError />;

  return (
    <div className="mx-auto mt-12 max-w-[1300px]">
      <div className="mx-auto mt-2 mb-20 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[350px_1fr] lg:gap-0">
          <div className="lg:contents">
            <ProjectEditForm project={project} />
          </div>
        </div>
      </div>
    </div>
  );
}
