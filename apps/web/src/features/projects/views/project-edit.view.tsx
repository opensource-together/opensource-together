"use client";

import ProjectDetailError from "../components/error-ui/project-detail-content-error.component";
import ProjectEditMode from "../components/project-edit-mode.component";
import ProjectSideBarEdit from "../components/project-side-bar-edit.component";
import SkeletonProjectDetail from "../components/skeletons/skeleton-project-detail.component";
import ProjectEditForm from "../forms/project-edit.form";
import { useProject } from "../hooks/use-projects.hook";

export default function ProjectEditView({ projectId }: { projectId: string }) {
  const { data: project, isLoading, isError } = useProject(projectId);

  if (isLoading) return <SkeletonProjectDetail />;
  if (isError || !project) return <ProjectDetailError />;

  return (
    <ProjectEditForm project={project}>
      {({
        form,
        onSubmit,
        isSubmitting,
        techStackOptions,
        categoriesOptions,
      }) => (
        <>
          <div className="mx-auto mt-12 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40"></div>
          <div className="mx-auto mt-2 flex max-w-[1300px] flex-col gap-8 px-4 sm:px-6 md:mt-4 md:px-8 lg:px-24 xl:px-40">
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:gap-16">
              <div className="self-start lg:sticky lg:top-[100px] lg:pb-33">
                <ProjectSideBarEdit
                  project={project}
                  form={form}
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                  techStackOptions={techStackOptions}
                  categoriesOptions={categoriesOptions}
                />
              </div>
              <div className="flex w-full flex-col gap-8 lg:max-w-[668px]">
                <ProjectEditMode
                  project={project}
                  form={form}
                  isMaintainer={true}
                  onFileSelect={(file) => {
                    console.log("File selected:", file);
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </ProjectEditForm>
  );
}
