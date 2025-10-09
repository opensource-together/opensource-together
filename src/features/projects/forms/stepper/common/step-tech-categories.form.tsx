"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
import { InputWithIcon } from "@/shared/components/ui/input-with-icon";
import { useCategories } from "@/shared/hooks/use-category.hook";
import { useTechStack } from "@/shared/hooks/use-tech-stack.hook";

import { FormNavigationButtons } from "../../../components/stepper/stepper-navigation-buttons.component";
import { useProjectCreateStore } from "../../../stores/project-create.store";
import {
  StepTechCategoriesFormData,
  stepTechCategoriesSchema,
} from "../../../validations/project-stepper.schema";

export function StepTechCategoriesForm() {
  const router = useRouter();
  const { formData, updateProjectInfo } = useProjectCreateStore();
  const { techStackOptions, isLoading: techStacksLoading } = useTechStack();
  const {
    categoryOptions,
    getCategoriesByIds,
    isLoading: categoriesLoading,
  } = useCategories();

  const getPreFilledLinks = () => {
    const repoUrl = formData.selectedRepository?.html_url || "";
    const provider = formData.method;

    return {
      github: provider === "github" ? repoUrl : "",
      gitlab: provider === "gitlab" ? repoUrl : "",
    };
  };

  const form = useForm<StepTechCategoriesFormData>({
    resolver: zodResolver(stepTechCategoriesSchema),
    defaultValues: {
      techStack: formData.techStack.map((tech) => tech.id) || [],
      categories: formData.categories.map((cat) => cat.id) || [],
      externalLinks: getPreFilledLinks(),
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    const preFilledLinks = getPreFilledLinks();
    setValue("externalLinks", preFilledLinks);
  }, [formData.selectedRepository, formData.method, setValue]);

  const handlePrevious = () => {
    router.push("/projects/create/describe");
  };

  const onSubmit = handleSubmit((data) => {
    const selectedCategoriesData = getCategoriesByIds(data.categories);

    updateProjectInfo({
      techStack: techStackOptions.filter((tech) =>
        data.techStack.includes(tech.id)
      ),
      categories: selectedCategoriesData,
    });

    router.push("/projects/create/success");
  });

  return (
    <Form {...form}>
      <form className="flex w-full flex-col gap-6" onSubmit={onSubmit}>
        <FormField
          control={control}
          name="techStack"
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
          name="categories"
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
          <FormField
            control={control}
            name="externalLinks.github"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputWithIcon
                    icon="github"
                    placeholder="https://github.com/..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="externalLinks.gitlab"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputWithIcon
                    icon="gitlab"
                    placeholder="https://gitlab.com/..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="externalLinks.discord"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputWithIcon
                    icon="discord"
                    placeholder="https://discord.gg/..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="externalLinks.twitter"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputWithIcon
                    icon="twitter"
                    placeholder="https://x.com/..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="externalLinks.linkedin"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputWithIcon
                    icon="linkedin"
                    placeholder="https://linkedin.com/..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="externalLinks.website"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputWithIcon
                    icon="link"
                    placeholder="https://..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormNavigationButtons
          onPrevious={handlePrevious}
          isLoading={isSubmitting}
          nextLabel="Create Project"
          nextType="submit"
        />
      </form>
    </Form>
  );
}
