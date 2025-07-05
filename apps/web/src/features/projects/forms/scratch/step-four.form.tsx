"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { AvatarUpload } from "@/shared/components/ui/avatar-upload";
import { InputWithIcon } from "@/shared/components/ui/input-with-icon";
import { Label } from "@/shared/components/ui/label";

import { useProjectCreateStore } from "@/features/projects/stores/project-create.store";
import {
  type StepFourFormData,
  stepFourSchema,
} from "@/features/projects/validations/project-stepper.schema";

import { FormNavigationButtons } from "../../components/stepper/stepper-navigation-buttons.component";

interface StepFourFormProps {
  onSubmit: () => void;
  isLoading: boolean;
}

export function StepFourForm({ onSubmit, isLoading }: StepFourFormProps) {
  const router = useRouter();
  const { formData, updateProjectInfo } = useProjectCreateStore();

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

  const handlePrevious = () => {
    router.push("/projects/create/scratch/step-three");
  };

  const handleLogoSelect = (file: File | null) => {
    form.setValue("logo", file || undefined);
  };

  const handleSubmit = async (data: StepFourFormData) => {
    try {
      // Update the store with step 4 data
      const externalLinksArray = [];

      if (data.externalLinks?.github) {
        externalLinksArray.push({
          type: "github" as const,
          url: data.externalLinks.github,
        });
      }
      if (data.externalLinks?.discord) {
        externalLinksArray.push({
          type: "discord" as const,
          url: data.externalLinks.discord,
        });
      }
      if (data.externalLinks?.twitter) {
        externalLinksArray.push({
          type: "twitter" as const,
          url: data.externalLinks.twitter,
        });
      }
      if (data.externalLinks?.website) {
        externalLinksArray.push({
          type: "other" as const,
          url: data.externalLinks.website,
        });
      }

      updateProjectInfo({
        image: data.logo ? URL.createObjectURL(data.logo) : "",
        externalLinks: externalLinksArray,
      });

      // Call the onSubmit function passed from the view
      onSubmit();
    } catch (error) {
      console.error("Erreur lors de la préparation des données:", error);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex w-full flex-col gap-5"
    >
      <div>
        <Label>Choisir un avatar</Label>
        <AvatarUpload
          onFileSelect={handleLogoSelect}
          accept="image/*"
          maxSize={1}
          size="xl"
          name={formData.projectName}
          fallback={formData.projectName}
          className="mt-4"
        />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <Label>Liens externes</Label>
        <div className="space-y-2">
          <InputWithIcon
            icon="github"
            placeholder="https://github.com/..."
            {...form.register("externalLinks.github")}
          />
          {form.formState.errors.externalLinks?.github && (
            <p className="text-sm text-red-600">
              {form.formState.errors.externalLinks.github.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <InputWithIcon
            icon="discord"
            placeholder="https://discord.gg/..."
            {...form.register("externalLinks.discord")}
          />
          {form.formState.errors.externalLinks?.discord && (
            <p className="text-sm text-red-600">
              {form.formState.errors.externalLinks.discord.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <InputWithIcon
            icon="twitter"
            placeholder="https://x.com/..."
            {...form.register("externalLinks.twitter")}
          />
          {form.formState.errors.externalLinks?.twitter && (
            <p className="text-sm text-red-600">
              {form.formState.errors.externalLinks.twitter.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <InputWithIcon
            icon="link"
            placeholder="https://..."
            {...form.register("externalLinks.website")}
          />
          {form.formState.errors.externalLinks?.website && (
            <p className="text-sm text-red-600">
              {form.formState.errors.externalLinks.website.message}
            </p>
          )}
        </div>
      </div>

      <FormNavigationButtons
        onPrevious={handlePrevious}
        onNext={() => form.handleSubmit(handleSubmit)()}
        previousLabel="Retour"
        nextLabel="Publier le projet"
        isLoading={isLoading}
        isNextDisabled={false} // No specific disabled state for this step
        nextType="button"
      />
    </form>
  );
}
