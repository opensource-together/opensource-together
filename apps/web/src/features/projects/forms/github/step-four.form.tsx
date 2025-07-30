"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { useCategories } from "@/shared/hooks/use-category.hook";
import { useTechStack } from "@/shared/hooks/use-tech-stack.hook";

import { FormNavigationButtons } from "../../components/stepper/stepper-navigation-buttons.component";
import { useProjectCreateStore } from "../../stores/project-create.store";
import {
  StepTwoFormData,
  stepTwoSchema,
} from "../../validations/project-stepper.schema";

export function StepFourForm() {
  const router = useRouter();
  const { formData, updateProjectInfo } = useProjectCreateStore();
  const { techStackOptions, isLoading: techStacksLoading } = useTechStack();
  const {
    categoryOptions,
    getCategoriesByIds,
    isLoading: categoriesLoading,
  } = useCategories();

  const form = useForm<StepTwoFormData>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      techStack: formData.techStack.map((tech) => tech.id) || [],
      categories: formData.categories.map((cat) => cat.id) || [],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const handlePrevious = () => {
    router.push("/projects/create/github/step-three");
  };

  const onSubmit = handleSubmit((data) => {
    const selectedCategoriesData = getCategoriesByIds(data.categories);

    updateProjectInfo({
      techStack: techStackOptions.filter((tech) =>
        data.techStack.includes(tech.id)
      ),
      categories: selectedCategoriesData,
    });

    router.push("/projects/create/github/step-five");
  });

  return (
    <Form {...form}>
      <form className="flex w-full flex-col gap-6" onSubmit={onSubmit}>
        <FormField
          control={control}
          name="techStack"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                required
                tooltip="Sélectionnez les technologies, langages de programmation et outils utilisés dans votre projet. Cela aide les développeurs à identifier les projets correspondant à leurs compétences."
              >
                Technologies (max 10)
              </FormLabel>
              <FormControl>
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
                tooltip="Choisissez les domaines ou secteurs d'activité auxquels votre projet se rapporte. Cela permet aux utilisateurs de découvrir votre projet selon leurs centres d'intérêt."
              >
                Catégories (max 6)
              </FormLabel>
              <FormControl>
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

        <FormNavigationButtons
          onPrevious={handlePrevious}
          previousLabel="Retour"
          nextLabel="Suivant"
          isLoading={isSubmitting}
          nextType="submit"
        />
      </form>
    </Form>
  );
}
