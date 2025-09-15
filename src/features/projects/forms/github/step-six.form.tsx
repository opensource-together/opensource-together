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

import { useCreateProject } from "@/features/projects/hooks/use-projects.hook";
import { useProjectCreateStore } from "@/features/projects/stores/project-create.store";
import {
  type StepFourFormData,
  stepFourSchema,
} from "@/features/projects/validations/project-stepper.schema";

import { ProjectImportationConfirmDialog } from "../../components/stepper/import-confirmation-dialog.component";
import { FormNavigationButtons } from "../../components/stepper/stepper-navigation-buttons.component";

export function StepSixForm() {
  const router = useRouter();
  const { formData, updateProjectInfo } = useProjectCreateStore();
  const { createProject, isCreating } = useCreateProject();
  const [showConfirmation, setShowConfirmation] = useState(false);
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
    router.push("/projects/create/github/step-five");
  };

  const handleLogoSelect = (file: File | null) => {
    setValue("logo", file || undefined);
  };

  const convertToExternalLinksArray = (
    formLinks: StepFourFormData["externalLinks"]
  ) => {
    const links: Array<{
      type: "GITHUB" | "DISCORD" | "TWITTER" | "LINKEDIN" | "OTHER";
      url: string;
    }> = [];

    if (formData.selectedRepository?.url) {
      links.push({
        type: "GITHUB",
        url: formData.selectedRepository.url,
      });
    }

    if (formLinks) {
      Object.entries(formLinks)
        .filter(([type, url]) => {
          return (
            typeof url === "string" && url.trim() && type !== "github" // Skip GitHub field since we already added the repo URL
          );
        })
        .forEach(([type, url]) => {
          links.push({
            type:
              type === "website"
                ? "OTHER"
                : (type.toUpperCase() as "DISCORD" | "TWITTER" | "LINKEDIN"),
            url: url as string,
          });
        });
    }

    return links;
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    setPendingFormData(data);
    setShowConfirmation(true);
  });

  const handleConfirmCreation = async () => {
    if (!pendingFormData) return;

    setShowConfirmation(false);

    const finalFormData = {
      ...formData,
      externalLinks: convertToExternalLinksArray(pendingFormData.externalLinks),
    };

    updateProjectInfo({
      externalLinks: finalFormData.externalLinks,
    });

    createProject({
      projectData: finalFormData,
      method: "github",
      imageFile: pendingFormData.logo,
    });
  };

  const handleCancelCreation = () => {
    setShowConfirmation(false);
    setPendingFormData(null);
  };

  const isLoadingState = isCreating || isSubmitting;

  return (
    <>
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
            <FormLabel tooltip="Partagez les liens vers vos réseaux sociaux, repository Github, serveur Discord ou site web. Ces liens aident les contributeurs à en savoir plus et à vous contacter.">
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
                      placeholder={
                        formData.selectedRepository?.url ||
                        "https://github.com/..."
                      }
                      value={formData.selectedRepository?.url || field.value}
                      disabled={!!formData.selectedRepository?.url}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  {formData.selectedRepository?.url && (
                    <p className="text-muted-foreground text-xs">
                      L'URL du repository Github sélectionné sera
                      automatiquement utilisée
                    </p>
                  )}
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
            nextLabel="Publier le projet"
            isLoading={isLoadingState}
            isNextDisabled={false}
            nextType="submit"
          />
        </form>
      </Form>

      <ProjectImportationConfirmDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        projectTitle={formData.title}
        isCreating={isCreating}
        onConfirm={handleConfirmCreation}
        onCancel={handleCancelCreation}
      />
    </>
  );
}
