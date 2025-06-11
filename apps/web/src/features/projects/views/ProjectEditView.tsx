"use client";

import Breadcrumb from "@/components/shared/Breadcrumb";

import ProjectEditForm from "../components/ProjectEditForm";
import ProjectEditSidebar from "../components/ProjectEditSidebar";
import ProjectEditFormError from "../components/error-ui/ProjectEditFormError";
import SkeletonProjectEditForm from "../components/skeletons/SkeletonProjectEditForm";
import { useProject } from "../hooks/useProjects";

export default function ProjectEditView({ projectId }: { projectId: string }) {
  const { data: project, isLoading, isError } = useProject(projectId);

  if (isLoading) return <SkeletonProjectEditForm />;
  if (isError || !project) return <ProjectEditFormError />;

  return (
    <>
      <div className="mx-auto mt-4 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Projects", href: "/projects" },
            { label: "Edit Project", href: "#", isActive: true },
          ]}
        />
      </div>
      <div className="mx-auto mt-4 max-w-[1300px] px-4 sm:px-6 md:mt-8 md:px-8 lg:px-24 xl:px-40">
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:gap-16">
          <ProjectEditForm project={project} />
          <ProjectEditSidebar project={project} />
        </div>
      </div>
    </>
  );
}
