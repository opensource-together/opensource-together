"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Combobox, ComboboxOption } from "@/shared/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";

import { FormNavigationButtons } from "../../components/stepper/stepper-navigation-buttons.component";
import { useTechStack } from "../../hooks/use-tech-stack";
import { useProjectCreateStore } from "../../stores/project-create.store";
import {
  StepTwoFormData,
  stepTwoSchema,
} from "../../validations/project-stepper.schema";

const CATEGORIES_OPTIONS: ComboboxOption[] = [
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

export function StepTwoForm() {
  const router = useRouter();
  const { formData, updateProjectInfo } = useProjectCreateStore();
  const { techStackOptions } = useTechStack();

  const form = useForm<StepTwoFormData>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      techStack: Array.isArray(formData.techStack)
        ? formData.techStack.map((tech) => tech.id)
        : [],
      categories: Array.isArray(formData.categories)
        ? formData.categories.map((cat) => cat.id)
        : [],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const handlePrevious = () => {
    router.push("/projects/create/scratch/step-one");
  };

  const onSubmit = handleSubmit((data) => {
    const selectedCategoriesData = CATEGORIES_OPTIONS.filter((category) =>
      data.categories.includes(category.id)
    );

    updateProjectInfo({
      techStack: techStackOptions.filter((tech) =>
        data.techStack.includes(tech.id)
      ),
      categories: selectedCategoriesData,
    });

    router.push("/projects/create/scratch/step-three");
  });

  return (
    <Form {...form}>
      <form className="flex w-full flex-col gap-6" onSubmit={onSubmit}>
        <FormField
          control={control}
          name="techStack"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Technologies</FormLabel>
              <FormControl>
                <Combobox
                  options={techStackOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Ajouter des technologies..."
                  searchPlaceholder="Rechercher une technologie..."
                  emptyText="Aucune technologie trouvée."
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
              <FormLabel required>Catégories</FormLabel>
              <FormControl>
                <Combobox
                  options={CATEGORIES_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Ajouter des catégories..."
                  searchPlaceholder="Rechercher une catégorie..."
                  emptyText="Aucune catégorie trouvée."
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
