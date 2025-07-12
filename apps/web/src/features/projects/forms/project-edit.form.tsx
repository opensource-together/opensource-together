import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import BreadcrumbComponent from "@/shared/components/shared/Breadcrumb";
import { useTechStack } from "@/shared/hooks/use-tech-stack.hook";

import { useUpdateProject } from "../hooks/use-projects.hook";
import { Project } from "../types/project.type";
import { ProjectSchema, projectSchema } from "../validations/project.schema";
import ProjectMainEditForm from "./project-main-edit.form";
import ProjectSidebarEditForm from "./project-sidebar-edit.form";

interface ProjectEditFormProps {
  project: Project;
}

export default function ProjectEditForm({ project }: ProjectEditFormProps) {
  const { techStackOptions } = useTechStack();
  const { updateProject, isUpdating } = useUpdateProject();
  const {
    image,
    title,
    shortDescription,
    longDescription,
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
      description: shortDescription || "",
      longDescription: longDescription || "",
      techStacks: techStacks || [],
      roles: roles || [],
      keyFeatures: keyFeatures?.map((feature) => feature.title) || [],
      projectGoals: projectGoals?.map((goal) => goal.goal) || [],
      categories: categories || [],
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
      data,
      projectId: project.id,
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
        {/* Breadcrumb */}
        <BreadcrumbComponent items={breadcrumbItems} className="mb-3" />

        <ProjectSidebarEditForm
          project={project}
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isUpdating}
          techStackOptions={techStackOptions}
        />
      </div>

      <ProjectMainEditForm
        project={project}
        form={form}
        onSubmit={onSubmit}
        onImageSelect={handleImageSelect}
      />
    </>
  );
}
