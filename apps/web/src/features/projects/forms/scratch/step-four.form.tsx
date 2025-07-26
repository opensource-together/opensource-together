"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

import { useProjectCreateStore } from "@/features/projects/stores/project-create.store";
import {
  type StepFourFormData,
  stepFourSchema,
} from "@/features/projects/validations/project-stepper.schema";

import { FormNavigationButtons } from "../../components/stepper/stepper-navigation-buttons.component";

export function StepFourForm() {
  const router = useRouter();
  const { formData, updateProjectInfo } = useProjectCreateStore();
  const [pendingFormData, setPendingFormData] =
    useState<StepFourFormData | null>(null);

  const form = useForm<StepFourFormData>({
    resolver: zodResolver(stepFourSchema),
    defaultValues: {
      logo: undefined,
      externalLinks: {
        github: "",
        discord: "",
        twitter: "",
        linkedin: "",
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
    if (!formLinks) return [];

    return Object.entries(formLinks)
      .filter(([_, url]) => typeof url === "string" && url.trim())
      .map(([type, url]) => ({
        type: type === "website" ? "other" : type,
        url: url as string,
      })) as Array<{
      type: "github" | "discord" | "twitter" | "linkedin" | "other";
      url: string;
    }>;
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    const finalFormData = {
      externalLinks: convertToExternalLinksArray(data.externalLinks),
    };

    // Update the store with final data
    updateProjectInfo(finalFormData);

    // Store the logo file in session storage for step 5
    if (data.logo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        sessionStorage.setItem('projectLogo', reader.result as string);
        sessionStorage.setItem('projectLogoName', data.logo!.name);
        sessionStorage.setItem('projectLogoType', data.logo!.type);
      };
      reader.readAsDataURL(data.logo);
    }

    // Navigate to step 5
    router.push("/projects/create/scratch/step-five");
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleFormSubmit}
        className="flex w-full flex-col gap-5"
      >
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
                  name={formData.title}
                  fallback={formData.title}
                  className="mt-4"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4 flex flex-col gap-4">
          <FormLabel tooltip="Partagez les liens vers vos réseaux sociaux, repository GitHub, serveur Discord ou site web. Ces liens aident les contributeurs à en savoir plus et à vous contacter.">
            Liens externes
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
          previousLabel="Retour"
          nextLabel="Suivant"
          isLoading={isSubmitting}
          isNextDisabled={false}
          nextType="submit"
        />
      </form>
    </Form>
  );
}
