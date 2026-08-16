"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";
import { ErrorState } from "@/shared/components/ui/error-state";
import { getErrorMessage } from "@/shared/lib/get-error-message";

import SkeletonProjectDetail from "../components/skeletons/skeleton-project-detail.component";
import ProjectMainEditForm from "../forms/project-main-edit.form";
import ProjectSidebarEditForm from "../forms/project-sidebar-edit.form";
import { projectKeys } from "../hooks/project.keys";
import {
  useAddProjectCoverMutation,
  useDeleteProjectImageMutation,
  useUpdateProjectLogoMutation,
  useUpdateProjectMutation,
} from "../hooks/project.mutations";
import { useProjectQuery } from "../hooks/project.queries";
import {
  type UpdateProjectInput,
  updateProjectApiSchema,
} from "../validations/project.schema";

export default function ProjectEditView({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { data: project, isLoading, isError } = useProjectQuery(projectId);
  const updateProjectMutation = useUpdateProjectMutation();
  const updateProjectLogoMutation = useUpdateProjectLogoMutation();
  const addProjectCoverMutation = useAddProjectCoverMutation();
  const deleteProjectImageMutation = useDeleteProjectImageMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [newCoverFiles, setNewCoverFiles] = useState<File[]>([]);
  const [removedCoverImages, setRemovedCoverImages] = useState<string[]>([]);

  const form = useForm<UpdateProjectInput>({
    resolver: zodResolver(updateProjectApiSchema),
    defaultValues: {
      logoUrl: project?.logoUrl || undefined,
      title: project?.title || "",
      description: project?.description || "",
      provider: project?.provider || undefined,
      published: project?.published || false,
      projectTechStacks:
        project?.projectTechStacks?.flatMap((tech) =>
          tech?.id ? [tech.id] : []
        ) || [],
      projectCategories:
        project?.projectCategories?.flatMap((category) =>
          category?.id ? [category.id] : []
        ) || [],
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
      projectTechStacks:
        project.projectTechStacks?.flatMap((tech) =>
          tech?.id ? [tech.id] : []
        ) || [],
      projectCategories:
        project.projectCategories?.flatMap((category) =>
          category?.id ? [category.id] : []
        ) || [],
      imagesUrls: project.imagesUrls || [],
      repoUrl: project.repoUrl || "",
      githubUrl: project.githubUrl || "",
      gitlabUrl: project.gitlabUrl || "",
      discordUrl: project.discordUrl || "",
      twitterUrl: project.twitterUrl || "",
      linkedinUrl: project.linkedinUrl || "",
      websiteUrl: project.websiteUrl || "",
    });
    setRemovedCoverImages([]);
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

    const updatedImagesUrls = (data.imagesUrls || []).filter(
      (url: string) => !removedCoverImages.includes(url)
    );

    setIsSubmitting(true);
    try {
      await updateProjectMutation.mutateAsync({
        projectId: id,
        data: {
          ...data,
          imagesUrls: updatedImagesUrls,
        },
      });

      await Promise.all([
        ...removedCoverImages.map((imageUrl) =>
          deleteProjectImageMutation.mutateAsync({
            projectId: id,
            imageUrl,
          })
        ),
        ...(selectedImageFile
          ? [
              updateProjectLogoMutation.mutateAsync({
                projectId: id,
                file: selectedImageFile,
              }),
            ]
          : []),
        ...newCoverFiles.map((coverFile) =>
          addProjectCoverMutation.mutateAsync({
            projectId: id,
            file: coverFile,
          })
        ),
      ]);

      toast.success("Project updated successfully");
      router.push(`/projects/${id}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Error while updating project"));
    } finally {
      setIsSubmitting(false);
    }
  });

  if (isLoading) return <SkeletonProjectDetail />;
  if (isError || !project)
    return (
      <ErrorState
        message="An error has occurred while loading the project edit. Please try again later."
        queryKey={projectKeys.detail(projectId)}
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
          isUpdating={isSubmitting}
          onCoverFilesChange={setNewCoverFiles}
          onRemoveExistingCover={(imageUrl) => {
            setRemovedCoverImages((prev) =>
              prev.includes(imageUrl) ? prev : [...prev, imageUrl]
            );
          }}
          currentCoverImages={visibleCoverImages}
        />
      }
    />
  );
}
