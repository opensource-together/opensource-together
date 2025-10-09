"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Combobox } from "@/shared/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { SocialLinksFormFields } from "@/shared/components/ui/social-links-form-fields";
import { useCategories } from "@/shared/hooks/use-category.hook";
import { useTechStack } from "@/shared/hooks/use-tech-stack.hook";

import { ProjectImportationConfirmDialog } from "@/features/projects/components/stepper/import-confirmation-dialog.component";
import { useCreateProject } from "@/features/projects/hooks/use-projects.hook";
import { ProjectSchema } from "@/features/projects/validations/project.schema";

import { FormNavigationButtons } from "../../../components/stepper/stepper-navigation-buttons.component";
import { useProjectCreateStore } from "../../../stores/project-create.store";
import {
  StepTechCategoriesFormData,
  stepTechCategoriesSchema,
} from "../../../validations/project-stepper.schema";

export function StepTechCategoriesForm() {
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingFormData, setPendingFormData] =
    useState<StepTechCategoriesFormData | null>(null);

  const { createProject, isCreating } = useCreateProject();

  const { formData, updateProjectInfo } = useProjectCreateStore();
  const { techStackOptions, isLoading: techStacksLoading } = useTechStack();
  const { categoryOptions, isLoading: categoriesLoading } = useCategories();

  const getPreFilledUrls = useCallback(() => {
    const repoUrl = formData.selectedRepository?.html_url || "";
    const provider = formData.method;

    return {
      githubUrl: provider === "github" ? repoUrl : "",
      gitlabUrl: provider === "gitlab" ? repoUrl : "",
      discordUrl: "",
      twitterUrl: "",
      linkedinUrl: "",
      websiteUrl: "",
    };
  }, [formData.selectedRepository?.html_url, formData.method]);

  const form = useForm<StepTechCategoriesFormData>({
    resolver: zodResolver(stepTechCategoriesSchema),
    defaultValues: {
      projectTechStacks: formData.projectTechStacks || [],
      projectCategories: formData.projectCategories || [],
      ...getPreFilledUrls(),
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    const preFilledUrls = getPreFilledUrls();
    Object.entries(preFilledUrls).forEach(([key, value]) => {
      setValue(key as keyof StepTechCategoriesFormData, value);
    });
  }, [getPreFilledUrls, setValue]);

  const handlePrevious = () => {
    router.push("/projects/create/describe");
  };

  const handleConfirmCreation = async () => {
    if (!pendingFormData) return;

    setShowConfirmation(false);

    // Prepare project data
    const projectData: ProjectSchema = {
      title: formData.title,
      description: formData.description,
      provider: formData.method.toUpperCase() as
        | "GITHUB"
        | "GITLAB"
        | "SCRATCH",
      projectTechStacks: pendingFormData.projectTechStacks || [],
      projectCategories: pendingFormData.projectCategories || [],
      githubUrl: pendingFormData.githubUrl || "",
      gitlabUrl: pendingFormData.gitlabUrl || "",
      discordUrl: pendingFormData.discordUrl || "",
      twitterUrl: pendingFormData.twitterUrl || "",
      linkedinUrl: pendingFormData.linkedinUrl || "",
      websiteUrl: pendingFormData.websiteUrl || "",
    };

    // Update the store with form data
    updateProjectInfo({
      projectTechStacks: pendingFormData.projectTechStacks || [],
      projectCategories: pendingFormData.projectCategories || [],
      githubUrl: pendingFormData.githubUrl || "",
      gitlabUrl: pendingFormData.gitlabUrl || "",
      discordUrl: pendingFormData.discordUrl || "",
      twitterUrl: pendingFormData.twitterUrl || "",
      linkedinUrl: pendingFormData.linkedinUrl || "",
      websiteUrl: pendingFormData.websiteUrl || "",
    });

    createProject(projectData);
  };

  const handleCancelCreation = () => {
    setShowConfirmation(false);
    setPendingFormData(null);
  };

  const onSubmit = handleSubmit((data) => {
    // Store the form data for confirmation
    setPendingFormData(data);

    // Update the store with form data
    updateProjectInfo({
      projectTechStacks: data.projectTechStacks,
      projectCategories: data.projectCategories,
      githubUrl: data.githubUrl || "",
      gitlabUrl: data.gitlabUrl || "",
      discordUrl: data.discordUrl || "",
      twitterUrl: data.twitterUrl || "",
      linkedinUrl: data.linkedinUrl || "",
      websiteUrl: data.websiteUrl || "",
    });

    setShowConfirmation(true);
  });

  return (
    <Form {...form}>
      <form className="flex w-full flex-col gap-6" onSubmit={onSubmit}>
        <FormField
          control={control}
          name="projectTechStacks"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Select technologies (max 10)</FormLabel>
              <FormControl>
                <Combobox
                  options={techStackOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={
                    techStacksLoading
                      ? "Loading technologies..."
                      : "Add technologies..."
                  }
                  searchPlaceholder="Search a technology..."
                  emptyText="No technology found."
                  disabled={techStacksLoading}
                  maxSelections={10}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="projectCategories"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Select categories (max 6)</FormLabel>
              <FormControl>
                <Combobox
                  options={categoryOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={
                    categoriesLoading
                      ? "Loading categories..."
                      : "Add categories..."
                  }
                  searchPlaceholder="Search a category..."
                  emptyText="No category found."
                  disabled={categoriesLoading}
                  maxSelections={6}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          <FormLabel>External links</FormLabel>
          <SocialLinksFormFields form={form} />
        </div>

        <FormNavigationButtons
          onPrevious={handlePrevious}
          isLoading={isSubmitting}
          nextLabel="Create Project"
          nextType="submit"
        />

        <ProjectImportationConfirmDialog
          open={showConfirmation}
          onOpenChange={setShowConfirmation}
          projectTitle={formData.title}
          isCreating={isCreating}
          onConfirm={handleConfirmCreation}
          onCancel={handleCancelCreation}
        />
      </form>
    </Form>
  );
}
