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
import { ProjectSchema } from "../validations/project.schema";

interface ProjectSidebarEditFormProps {
  project: Project;
  form: UseFormReturn<ProjectSchema>;
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
                <FormLabel required>Technologies (max 10)</FormLabel>
                <FormControl className="mt-[-6px]">
                  <Combobox
                    options={techStackOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={
                      techStacksLoading
                        ? "Chargement des technologies..."
                        : "Ajouter des technologies..."
                    }
                    searchPlaceholder="Rechercher une technologie..."
                    emptyText="Aucune technologie trouvée."
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
                <FormLabel required>Catégories (max 6)</FormLabel>
                <FormControl className="mt-[-6px]">
                  <Combobox
                    options={categoryOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={
                      categoriesLoading
                        ? "Chargement des catégories..."
                        : "Ajouter des catégories..."
                    }
                    searchPlaceholder="Rechercher une catégorie..."
                    emptyText="Aucune catégorie trouvée."
                    disabled={categoriesLoading}
                    maxSelections={6}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-0 flex flex-col gap-4">
            <FormLabel>Liens sociaux</FormLabel>
            <SocialLinksFormFields form={form} />
          </div>
        </Form>
      </div>
    </div>
  );
}
