"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";

import ProjectDetailError from "../components/error-ui/project-detail-content-error.component";
import SkeletonProjectDetail from "../components/skeletons/skeleton-project-detail.component";
import ProjectMainEditForm from "../forms/project-main-edit.form";
import ProjectSidebarEditForm from "../forms/project-sidebar-edit.form";
import { useProject, useUpdateProject } from "../hooks/use-projects.hook";
import { ProjectSchema, projectSchema } from "../validations/project.schema";

export default function ProjectEditView({ projectId }: { projectId: string }) {
  const { data: project, isLoading, isError } = useProject(projectId);
  const { updateProject, isUpdating } = useUpdateProject();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [shouldDeleteImage, setShouldDeleteImage] = useState(false);
  const [newCoverFiles, setNewCoverFiles] = useState<File[]>([]);
  const [removedCoverImages, setRemovedCoverImages] = useState<string[]>([]);

  const form = useForm<ProjectSchema>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      logoUrl: project?.logoUrl || undefined,
      title: project?.title || "",
      description: project?.description || "",
      projectTechStacks:
        project?.projectTechStacks?.map((tech) => tech.id) || [],
      projectCategories:
        project?.projectCategories?.map((category) => category.id) || [],
      imagesUrls: project?.imagesUrls || [],
      githubUrl: project?.githubUrl || "",
      gitlabUrl: project?.gitlabUrl || "",
      discordUrl: project?.discordUrl || "",
      twitterUrl: project?.twitterUrl || "",
      linkedinUrl: project?.linkedinUrl || "",
      websiteUrl: project?.websiteUrl || "",
    },
  });

  const { setValue } = form;

  const visibleCoverImages = (project?.imagesUrls || []).filter(
    (url: string) => !removedCoverImages.includes(url)
  );

  const handleImageSelect = (file: File | null) => {
    if (file) {
      setSelectedImageFile(file);
      setShouldDeleteImage(false);
      setValue("logoUrl", "new-image-selected");
    } else {
      setSelectedImageFile(null);
      setShouldDeleteImage(true);
      setValue("logoUrl", "");
    }
  };

  const onSubmit = form.handleSubmit(async (data) => {
    if (!project) return;

    updateProject({
      data: {
        ...data,
        logoUrl: shouldDeleteImage ? undefined : data.logoUrl,
      },
      projectId: project.id || "",
    });
  });

  if (isLoading) return <SkeletonProjectDetail />;
  if (isError || !project) return <ProjectDetailError />;

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
          onRemoveExistingCover={(imageUrl) =>
            setRemovedCoverImages((prev) =>
              prev.includes(imageUrl) ? prev : [...prev, imageUrl]
            )
          }
          currentCoverImages={visibleCoverImages}
        />
      }
    />
  );
}
