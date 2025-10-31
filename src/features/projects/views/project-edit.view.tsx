"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";
import { ErrorState } from "@/shared/components/ui/error-state";

import SkeletonProjectDetail from "../components/skeletons/skeleton-project-detail.component";
import ProjectMainEditForm from "../forms/project-main-edit.form";
import ProjectSidebarEditForm from "../forms/project-sidebar-edit.form";
import {
  useDeleteProjectImage,
  useProject,
  useUpdateProject,
  useUpdateProjectCover,
  useUpdateProjectLogo,
} from "../hooks/use-projects.hook";
import {
  UpdateProjectApiData,
  UpdateProjectData,
  updateProjectApiSchema,
} from "../validations/project.schema";

export default function ProjectEditView({ projectId }: { projectId: string }) {
  const { data: project, isLoading, isError } = useProject(projectId);
  const { updateProject, isUpdating } = useUpdateProject();
  const { updateProjectLogo } = useUpdateProjectLogo();
  const { updateProjectCover } = useUpdateProjectCover();
  const { deleteProjectImage } = useDeleteProjectImage();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [newCoverFiles, setNewCoverFiles] = useState<File[]>([]);
  const [removedCoverImages, setRemovedCoverImages] = useState<string[]>([]);

  const form = useForm<UpdateProjectApiData>({
    resolver: zodResolver(updateProjectApiSchema),
    defaultValues: {
      logoUrl: project?.logoUrl || undefined,
      title: project?.title || "",
      description: project?.description || "",
      provider: project?.provider || undefined,
      published: project?.published || false,
      projectTechStacks:
        project?.projectTechStacks?.map((tech) => tech.id) || [],
      projectCategories:
        project?.projectCategories?.map((category) => category.id) || [],
      imagesUrls: project?.imagesUrls || [],
      repoUrl: project?.repoUrl || "",
      githubUrl: project?.githubUrl || "",
      gitlabUrl: project?.gitlabUrl || "",
      discordUrl: project?.discordUrl || "",
      twitterUrl: project?.twitterUrl || "",
      linkedinUrl: project?.linkedinUrl || "",
      websiteUrl: project?.websiteUrl || "",
    },
  });

  useEffect(() => {
    if (!project) return;
    form.reset({
      logoUrl: project.logoUrl || undefined,
      title: project.title || "",
      description: project.description || "",
      provider: project.provider || undefined,
      published: project.published || false,
      projectTechStacks: project.projectTechStacks?.map((t) => t.id) || [],
      projectCategories: project.projectCategories?.map((c) => c.id) || [],
      imagesUrls: project.imagesUrls || [],
      repoUrl: project.repoUrl || "",
      githubUrl: project.githubUrl || "",
      gitlabUrl: project.gitlabUrl || "",
      discordUrl: project.discordUrl || "",
      twitterUrl: project.twitterUrl || "",
      linkedinUrl: project.linkedinUrl || "",
      websiteUrl: project.websiteUrl || "",
    });
  }, [project, form]);

  const handleImageSelect = (file: File | null) => {
    setSelectedImageFile(file);
  };

  const visibleCoverImages = (project?.imagesUrls || []).filter(
    (url: string) => !removedCoverImages.includes(url)
  );

  const onSubmit = form.handleSubmit(async (data) => {
    if (!project) return;

    const id = project.id || project.publicId || "";
    updateProject({ id, updateData: data as UpdateProjectData });

    if (selectedImageFile) {
      updateProjectLogo({
        projectId: id,
        logoFile: selectedImageFile,
      });
    }

    if (newCoverFiles && newCoverFiles.length > 0) {
      newCoverFiles.forEach((file) => {
        updateProjectCover({ projectId: id, coverFile: file });
      });
    }
  });

  if (isLoading) return <SkeletonProjectDetail />;
  if (isError || !project)
    return (
      <ErrorState
        message="An error has occurred while loading the project edit. Please try again later."
        queryKey={["project", projectId]}
        className="mt-20 mb-28"
        buttonText="Back to project"
        href={`/projects/${projectId}`}
      />
    );

  return (
    <TwoColumnLayout
      sidebar={<ProjectSidebarEditForm project={project} form={form} />}
      hero={
        <ProjectMainEditForm
          project={project}
          form={form}
          onSubmit={onSubmit}
          onImageSelect={handleImageSelect}
          isUpdating={isUpdating}
          onCoverFilesChange={setNewCoverFiles}
          onRemoveExistingCover={(imageUrl) => {
            const id = project.publicId || project.id;
            if (!id) return;
            setRemovedCoverImages((prev) =>
              prev.includes(imageUrl) ? prev : [...prev, imageUrl]
            );
            deleteProjectImage({ projectId: id, imageUrl });
          }}
          currentCoverImages={visibleCoverImages}
        />
      }
    />
  );
}
