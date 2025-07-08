"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { AvatarUpload } from "@/shared/components/ui/avatar-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { InputWithIcon } from "@/shared/components/ui/input-with-icon";

import { useCreateProject } from "@/features/projects/hooks/use-projects.hook";
import { useProjectCreateStore } from "@/features/projects/stores/project-create.store";
import {
  type StepFourFormData,
  stepFourSchema,
} from "@/features/projects/validations/project-stepper.schema";

import { FormNavigationButtons } from "../../components/stepper/stepper-navigation-buttons.component";

interface StepFourFormProps {
  onSubmit?: () => void; // Rendre optionnel car on gère maintenant via le hook
  isLoading?: boolean; // Rendre optionnel car on utilise isCreating du hook
}

export function StepFourForm({
  onSubmit,
  isLoading: externalLoading,
}: StepFourFormProps) {
  const router = useRouter();
  const { formData, updateProjectInfo, resetForm } = useProjectCreateStore();
  const { createProject, isCreating } = useCreateProject();

  const form = useForm<StepFourFormData>({
    resolver: zodResolver(stepFourSchema),
    defaultValues: {
      logo: undefined,
      externalLinks: {
        github: "",
        discord: "",
        twitter: "",
        website: "",
      },
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = form;

  const handlePrevious = () => {
    router.push("/projects/create/scratch/step-three");
  };

  const handleLogoSelect = (file: File | null) => {
    setValue("logo", file || undefined);
  };

  // Convert form inputs to ExternalLink array format
  const convertToExternalLinksArray = (
    formLinks: StepFourFormData["externalLinks"]
  ) => {
    return Object.entries(formLinks)
      .filter(([_, url]) => typeof url === "string" && url.trim())
      .map(([type, url]) => ({
        type:
          type === "website"
            ? ("other" as const)
            : (type as "github" | "discord" | "twitter"),
        url: url as string,
      }));
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    console.log("🚀 SUBMIT TRIGGERED !");

    try {
      console.log("=== FORM: DÉBUT DU SUBMIT ===");

      // Mise à jour des données dans le store avec les informations du formulaire
      updateProjectInfo({
        image: data.logo ? URL.createObjectURL(data.logo) : "",
        externalLinks: convertToExternalLinksArray(data.externalLinks),
      });

      // Vérifier que les données essentielles sont présentes
      if (!formData.projectName.trim()) {
        throw new Error("Le nom du projet est requis");
      }

      if (!formData.shortDescription.trim()) {
        throw new Error("La description courte est requise");
      }

      console.log("=== FORM: DONNÉES DU STORE ===");
      console.log("FormData:", formData);

      console.log("=== FORM: APPEL DE createProject ===");

      // Appel API via le hook (syntaxe correcte pour TanStack Query)
      createProject(formData);

      console.log("=== FORM: createProject appelé ===");
    } catch (error) {
      console.error("Erreur lors de la préparation des données:", error);
    }
  });

  // Utiliser isCreating du hook ou isLoading externe
  const isLoadingState = isCreating || externalLoading || isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="flex w-full flex-col gap-5">
        <FormField
          control={control}
          name="logo"
          render={() => (
            <FormItem>
              <FormLabel>Choisir un avatar</FormLabel>
              <FormControl>
                <AvatarUpload
                  onFileSelect={handleLogoSelect}
                  accept="image/*"
                  maxSize={1}
                  size="xl"
                  name={formData.projectName}
                  fallback={formData.projectName}
                  className="mt-4"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4 flex flex-col gap-4">
          <FormLabel>Liens externes</FormLabel>

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
          previousLabel="Retour"
          nextLabel="Publier le projet"
          isLoading={isLoadingState}
          isNextDisabled={false}
          nextType="submit"
        />
      </form>
    </Form>
  );
}
