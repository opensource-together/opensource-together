import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useUpdateProject } from "../hooks/use-projects.hook";
import { useTechStack } from "../hooks/use-tech-stack";
import {
  Project,
  ProjectEditForm as ProjectEditFormType,
} from "../types/project.type";
import { projectSchema } from "../validations/project.schema";

const CATEGORIES_OPTIONS = [
  { id: "ai", name: "IA" },
  { id: "finance", name: "Finance" },
  { id: "health", name: "Santé" },
  { id: "education", name: "Education" },
  { id: "transport", name: "Transport" },
  { id: "ecommerce", name: "E-commerce" },
  { id: "security", name: "Sécurité" },
  { id: "marketing", name: "Marketing" },
  { id: "sales", name: "Vente" },
  { id: "management", name: "Gestion" },
  { id: "other", name: "Autre" },
];

interface ProjectEditFormProps {
  project: Project;
  children: (props: {
    form: ReturnType<typeof useForm<ProjectEditFormType>>;
    onSubmit: () => void;
    isSubmitting: boolean;
    techStackOptions: { id: string; name: string; iconUrl?: string }[];
    categoriesOptions: { id: string; name: string }[];
  }) => React.ReactNode;
}

export default function ProjectEditForm({
  project,
  children,
}: ProjectEditFormProps) {
  const router = useRouter();
  const { techStackOptions } = useTechStack();
  const { updateProject, isUpdating } = useUpdateProject(() => {
    router.push(`/projects/${project.id}`);
  });

  const form = useForm<ProjectEditFormType>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
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

  // Reset form when project data changes
  useEffect(() => {
    if (project) {
      // Convert array format to string format for keyFeatures and projectGoals
      const keyFeaturesText = Array.isArray(project.keyFeatures)
        ? project.keyFeatures.map((feature) => feature.title).join("\n")
        : project.keyFeatures || "";

      const projectGoalsText = Array.isArray(project.projectGoals)
        ? project.projectGoals.map((goal) => goal.goal).join("\n")
        : project.projectGoals || "";

      form.reset({
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
            experienceBadge: undefined,
          })) || [],
        keyBenefits: [],
        socialLinks:
          project.externalLinks?.map((link) => ({
            type: link.type,
            url: link.url,
          })) || [],
        keyFeatures: keyFeaturesText,
        projectGoals: projectGoalsText,
        categories: project.categories || [],
      });
    }
  }, [project, form]);

  const onSubmit = form.handleSubmit((data) => {
    if (!project?.id) return;

    console.log("Form submission data:", data);

    updateProject({
      data,
      projectId: project.id,
    });
  });

  return (
    <>
      {children({
        form,
        onSubmit,
        isSubmitting: isUpdating,
        techStackOptions,
        categoriesOptions: CATEGORIES_OPTIONS,
      })}
    </>
  );
}
