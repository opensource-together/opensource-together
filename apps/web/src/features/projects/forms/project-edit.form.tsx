import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import BreadcrumbComponent from "@/shared/components/shared/Breadcrumb";

import { useUpdateProject } from "../hooks/use-projects.hook";
import { Project } from "../types/project.type";
import { ProjectSchema, projectSchema } from "../validations/project.schema";
import ProjectMainEditForm from "./project-main-edit.form";
import ProjectSidebarEditForm from "./project-sidebar-edit.form";

interface ProjectEditFormProps {
  project: Project;
}

export default function ProjectEditForm({ project }: ProjectEditFormProps) {
  const { updateProject, isUpdating } = useUpdateProject();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [shouldDeleteImage, setShouldDeleteImage] = useState(false);

  const {
    image,
    title,
    shortDescription,
    techStacks,
    keyFeatures,
    projectGoals,
    categories,
  } = project;

  const form = useForm<ProjectSchema>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      image: image || undefined,
      title: title || "",
      shortDescription: shortDescription || "",
      keyFeatures: keyFeatures || [],
      projectGoals: projectGoals || [],
      techStack: techStacks?.map((tech) => tech.id) || [],
      categories: categories?.map((category) => category.id) || [],
      externalLinks:
        project.externalLinks?.reduce(
          (acc, link) => {
            const linkType = link.type === "other" ? "website" : link.type;
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

  const handleImageSelect = (file: File | null) => {
    if (file) {
      setSelectedImageFile(file);
      setShouldDeleteImage(false);
      setValue("image", "new-image-selected"); // Indicator that new image is selected
    } else {
      setSelectedImageFile(null);
      setShouldDeleteImage(true);
      setValue("image", ""); // Clear image
    }
  };

  const onSubmit = form.handleSubmit(async (data) => {
    updateProject({
      updateData: {
        data: {
          ...data,
          image: shouldDeleteImage ? undefined : data.image, // Let service handle the actual URL
        },
        projectId: project.id || "",
      },
      newImageFile: selectedImageFile || undefined,
      shouldDeleteImage,
    });
  });

  const breadcrumbItems = [
    {
      label: "Accueil",
      href: "/",
      isActive: false,
    },
    {
      label: project.title || "",
      href: `/projects/${project.id}`,
      isActive: false,
    },
    {
      label: "Édition",
      href: "#",
      isActive: true,
    },
  ];

  return (
    <>
      <div>
        <BreadcrumbComponent items={breadcrumbItems} className="mb-7" />
        <ProjectSidebarEditForm project={project} form={form} />
      </div>

      <ProjectMainEditForm
        project={project}
        form={form}
        onSubmit={onSubmit}
        onImageSelect={handleImageSelect}
        isUpdating={isUpdating}
      />
    </>
  );
}
