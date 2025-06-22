"use client";

import Breadcrumb from "@/shared/components/shared/Breadcrumb";

import ProjectEditFormError from "../components/error-ui/project-edit-form-error.component";
import ProjectEditForm from "../components/project-edit-form.component";
import ProjectEditSidebar from "../components/project-edit-sidebar.component";
import SkeletonProjectEditForm from "../components/skeletons/skeleton-project-edit-form.component";
import { useProject } from "../hooks/use-projects.hook";

/**
 * Displays the project editing view for a given project ID.
 *
 * Renders a loading skeleton while fetching project data, an error state if loading fails or data is missing, and the main editing interface with a breadcrumb, edit form, and sidebar when data is available.
 *
 * @param projectId - The unique identifier of the project to edit
 */
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
