import { UseFormReturn } from "react-hook-form";

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

import { Project } from "../types/project.type";
import { UpdateProjectApiData } from "../validations/project.schema";

interface ProjectSidebarEditFormProps {
  project: Project;
  form: UseFormReturn<UpdateProjectApiData>;
}

export default function ProjectSidebarEditForm({
  form,
}: ProjectSidebarEditFormProps) {
  const { techStackOptions, isLoading: techStacksLoading } = useTechStack();
  const { categoryOptions, isLoading: categoriesLoading } = useCategories();
  const { control } = form;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="flex flex-col space-y-6 md:max-w-[263px]">
        <Form {...form}>
          <FormField
            control={control}
            name="projectTechStacks"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Technologies (10 max)</FormLabel>
                <FormControl>
                  <Combobox
                    options={techStackOptions}
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder={
                      techStacksLoading
                        ? "Loading technologies..."
                        : "Add technologies..."
                    }
                    searchPlaceholder="Search technologies..."
                    emptyText="No technologies found."
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
                <FormLabel required>Categories (6 max)</FormLabel>
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
                    searchPlaceholder="Search categories..."
                    emptyText="No categories found."
                    disabled={categoriesLoading}
                    maxSelections={6}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-0 flex flex-col gap-4">
            <FormLabel>External links</FormLabel>
            <SocialLinksFormFields form={form} />
          </div>
        </Form>
      </div>
    </div>
  );
}
