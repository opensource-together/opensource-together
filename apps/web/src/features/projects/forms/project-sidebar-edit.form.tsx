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
import { InputWithIcon } from "@/shared/components/ui/input-with-icon";
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
            name="techStack"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  required
                  className="text-primary mb-2 text-sm font-medium"
                >
                  Technologies (max 10)
                </FormLabel>
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
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  required
                  className="text-primary mb-2 text-sm font-medium"
                >
                  Catégories (max 6)
                </FormLabel>
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
            <FormLabel className="text-primary mb-0 text-sm font-medium">
              Liens sociaux
            </FormLabel>

            <FormField
              control={control}
              name="externalLinks.github"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithIcon
                      icon="github"
                      placeholder="https://github.com/..."
                      className="bg-white"
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
                      className="bg-white"
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
                      className="bg-white"
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
                      className="bg-white"
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
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </div>
    </div>
  );
}
