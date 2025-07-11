import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { useProjectEditStore } from "../stores/project-edit.store";
import { Project } from "../types/project.type";
import {
  ProjectEditSchema,
  projectEditSchema,
} from "../validations/project.schema";
import { useUpdateProjectInline } from "./use-projects.hook";

export function useProjectEditForm(project: Project) {
  const {
    formData,
    setFormData,
    setOriginalProject,
    setIsDirty,
    setIsEditing,
    resetForm,
  } = useProjectEditStore();

  const { updateProject, isUpdating } = useUpdateProjectInline(() => {
    // Exit edit mode and reset form after successful update
    setIsEditing(false);
    setIsDirty(false);
  });

  const form = useForm<ProjectEditSchema>({
    resolver: zodResolver(projectEditSchema),
    defaultValues: {
      title: project.title || "",
      description: project.shortDescription || "",
      longDescription: project.longDescription || "",
      status: project.status || "DRAFT",
      techStacks: project.techStacks || [],
      categories: project.categories || [],
      keyFeatures: project.keyFeatures || [],
      projectGoals: project.projectGoals || [],
      externalLinks: {
        github:
          project.externalLinks?.find((link) => link.type === "github")?.url ||
          "",
        discord:
          project.externalLinks?.find((link) => link.type === "discord")?.url ||
          "",
        twitter:
          project.externalLinks?.find((link) => link.type === "twitter")?.url ||
          "",
        linkedin:
          project.externalLinks?.find((link) => link.type === "linkedin")
            ?.url || "",
        website:
          project.externalLinks?.find(
            (link) => link.type === "website" || link.type === "other"
          )?.url || "",
      },
    },
  });

  // Field arrays for dynamic content
  const {
    fields: keyFeaturesFields,
    append: appendKeyFeature,
    remove: removeKeyFeature,
  } = useFieldArray({
    control: form.control,
    name: "keyFeatures",
  });

  const {
    fields: projectGoalsFields,
    append: appendProjectGoal,
    remove: removeProjectGoal,
  } = useFieldArray({
    control: form.control,
    name: "projectGoals",
  });

  const {
    fields: techStacksFields,
    append: appendTechStack,
    remove: removeTechStack,
  } = useFieldArray({
    control: form.control,
    name: "techStacks",
  });

  const {
    fields: categoriesFields,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({
    control: form.control,
    name: "categories",
  });

  // Store original project data
  useEffect(() => {
    setOriginalProject(project);
  }, [project, setOriginalProject]);

  // Watch form changes and update store
  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData(value as any);
      setIsDirty(true);
    });
    return () => subscription.unsubscribe();
  }, [form, setFormData, setIsDirty]);

  // Reset form when project changes
  useEffect(() => {
    form.reset({
      title: project.title || "",
      description: project.shortDescription || "",
      longDescription: project.longDescription || "",
      status: project.status || "DRAFT",
      techStacks: project.techStacks || [],
      categories: project.categories || [],
      keyFeatures: project.keyFeatures || [],
      projectGoals: project.projectGoals || [],
      externalLinks: {
        github:
          project.externalLinks?.find((link) => link.type === "github")?.url ||
          "",
        discord:
          project.externalLinks?.find((link) => link.type === "discord")?.url ||
          "",
        twitter:
          project.externalLinks?.find((link) => link.type === "twitter")?.url ||
          "",
        linkedin:
          project.externalLinks?.find((link) => link.type === "linkedin")
            ?.url || "",
        website:
          project.externalLinks?.find(
            (link) => link.type === "website" || link.type === "other"
          )?.url || "",
      },
    });
  }, [project, form]);

  const onSubmit = form.handleSubmit((data) => {
    if (!project.id) return;

    // Convert externalLinks back to array format
    const externalLinksArray = Object.entries(data.externalLinks || {})
      .filter(([_, url]) => url && url.trim())
      .map(([type, url]) => ({
        type: type === "website" ? ("other" as const) : (type as any),
        url: url!,
      }));

    // Prepare data for update
    const updateData = {
      title: data.title,
      description: data.description,
      longDescription: data.longDescription,
      status: data.status,
      techStacks: data.techStacks || [],
      roles:
        project.roles?.map((role) => ({
          title: role.title,
          description: role.description,
          badges: [], // Required by schema
          experienceBadge: undefined,
          techStacks: role.techStacks || [],
        })) || [], // Keep existing roles with proper mapping
      keyBenefits: [], // Can be extended later
      socialLinks: externalLinksArray,
      keyFeatures: data.keyFeatures,
      projectGoals: data.projectGoals,
      categories: data.categories,
    };

    updateProject({
      projectId: project.id,
      data: updateData,
    });
  });

  return {
    // Form instance
    form,

    // Form actions
    onSubmit,
    isLoading: isUpdating,

    // Field arrays
    keyFeaturesFields,
    projectGoalsFields,
    techStacksFields,
    categoriesFields,

    // Field array methods
    appendKeyFeature,
    removeKeyFeature,
    appendProjectGoal,
    removeProjectGoal,
    appendTechStack,
    removeTechStack,
    appendCategory,
    removeCategory,
  };
}
