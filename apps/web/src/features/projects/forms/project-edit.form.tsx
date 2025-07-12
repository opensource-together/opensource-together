import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import BreadcrumbComponent from "@/shared/components/shared/Breadcrumb";

import { useUpdateProject } from "../hooks/use-projects.hook";
import { useTechStack } from "../hooks/use-tech-stack";
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

  const form = useForm<ProjectSchema>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      image: undefined,
      title: "",
      description: "",
      longDescription: "",
      status: "DRAFT",
      techStacks: [],
      roles: [],
      keyBenefits: [],
      socialLinks: [],
      keyFeatures: "",
      projectGoals: "",
      categories: [],
    },
  });

  const { setValue, reset } = form;

  // Fonction pour mapper les données du projet vers le formulaire
  const mapProjectToForm = (project: Project): ProjectSchema => {
    // Mapper les keyFeatures array vers string
    const keyFeaturesString =
      project.keyFeatures?.map((feature) => feature.title).join("\n") || "";

    // Mapper les projectGoals array vers string
    const projectGoalsString =
      project.projectGoals?.map((goal) => goal.goal).join("\n") || "";

    return {
      image: undefined, // On ne peut pas pré-remplir avec un File
      title: project.title || "",
      description: project.shortDescription || "",
      longDescription: project.longDescription || "",
      status: project.status || "DRAFT",
      techStacks: project.techStacks || [],
      roles:
        project.roles?.map((role) => ({
          title: role.title,
          description: role.description,
          badges: [],
          experienceBadge: role.roleCount?.toString() || "",
          techStacks: role.techStacks || [],
        })) || [],
      keyBenefits: project.keyFeatures?.map((f) => f.title) || [],
      socialLinks: project.externalLinks || [],
      keyFeatures: keyFeaturesString,
      projectGoals: projectGoalsString,
      categories: project.categories || [],
    };
  };

  // Effet pour pré-remplir le formulaire avec les données du projet
  useEffect(() => {
    if (project) {
      const formData = mapProjectToForm(project);
      reset(formData);
    }
  }, [project, reset]);

  const handleImageSelect = (file: File | null) => {
    setValue("image", file || undefined);
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
      <div className="self-start lg:sticky lg:top-[100px] lg:pb-33">
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
