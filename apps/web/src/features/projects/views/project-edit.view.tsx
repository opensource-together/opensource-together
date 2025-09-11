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
      image: project?.image || undefined,
      title: project?.title || "",
      description: project?.description || "",
      keyFeatures: project?.keyFeatures || [],
      techStack: project?.techStacks?.map((tech) => tech.id) || [],
      categories: project?.categories?.map((category) => category.id) || [],
      coverImages: project?.coverImages || [],
      externalLinks:
        project?.externalLinks?.reduce(
          (acc, link) => {
            const linkType =
              link.type === "OTHER" ? "website" : link.type.toLowerCase();
            acc[linkType as keyof typeof acc] = link.url;
            return acc;
          },
          {} as {
            github?: string;
            discord?: string;
            twitter?: string;
            linkedin?: string;
            website?: string;
          }
        ) || {},
    },
  });

  const { setValue } = form;

  const visibleCoverImages = (project?.coverImages || []).filter(
    (url) => !removedCoverImages.includes(url)
  );

  const handleImageSelect = (file: File | null) => {
    if (file) {
      setSelectedImageFile(file);
      setShouldDeleteImage(false);
      setValue("image", "new-image-selected");
    } else {
      setSelectedImageFile(null);
      setShouldDeleteImage(true);
      setValue("image", "");
    }
  };

  const onSubmit = form.handleSubmit(async (data) => {
    if (!project) return;

    updateProject({
      updateData: {
        data: {
          ...data,
          image: shouldDeleteImage ? undefined : data.image,
        },
        projectId: project.id || "",
      },
      newImageFile: selectedImageFile || undefined,
      shouldDeleteImage,
      newCoverFiles,
      removedCoverImages,
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
