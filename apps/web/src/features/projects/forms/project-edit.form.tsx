import { zodResolver } from "@hookform/resolvers/zod";
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
  const {
    image,
    title,
    shortDescription,
    techStacks,
    roles,
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
      projectRoles:
        roles?.map((role) => ({
          title: role.title,
          description: role.description,
          techStack: role.techStacks?.map((tech) => tech.id) || [],
        })) || [],
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
    setValue("image", file?.name || "");
  };

  const onSubmit = form.handleSubmit(async (data) => {
    if (!project?.id) return;
    console.log("Form submission data:", data);

    updateProject({
      projectId: project.id,
      data,
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
      <div className="self-start lg:sticky lg:top-[100px] lg:mb-36">
        <BreadcrumbComponent items={breadcrumbItems} className="mb-3" />
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
