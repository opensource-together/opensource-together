"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

import { useProjectCreateStore } from "../../store/project-create.store";
import {
  type ScratchStepOneFormData,
  scratchStepOneSchema,
} from "../../validations/scratch-step-one.schema";

export function StepOneForm() {
  const router = useRouter();
  const { formData, updateProjectInfo } = useProjectCreateStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ScratchStepOneFormData>({
    resolver: zodResolver(scratchStepOneSchema),
    defaultValues: {
      projectName: formData.projectName || "",
      description: formData.description || "",
      website: formData.website || "",
    },
  });

  const description = watch("description");

  const onSubmit = (data: ScratchStepOneFormData) => {
    updateProjectInfo({
      projectName: data.projectName,
      description: data.description,
      website: data.website || "",
    });

    router.push("/projects/create/scratch/step-two");
  };

  return (
    <form
      className="flex w-full flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <Label>Nom du projet</Label>
        <Input {...register("projectName")} maxLength={100} />
        {errors.projectName && (
          <p className="mt-1 text-sm text-red-500">
            {errors.projectName.message}
          </p>
        )}
      </div>

      <div>
        <div className="mr-2 mb-1 flex items-center justify-between">
          <Label>Description</Label>
          <span className="text-xs font-normal text-black/20">
            {description?.length || 0}/250
          </span>
        </div>
        <Textarea
          {...register("description")}
          placeholder="Décrivez votre projet"
          maxLength={250}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <Label>Lien vers le site web</Label>
        <Input {...register("website")} placeholder="https://example.com" />
        {errors.website && (
          <p className="mt-1 text-sm text-red-500">{errors.website.message}</p>
        )}
      </div>

      <Button
        size="lg"
        className="flex items-center justify-center"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Validation..." : "Confirmer et continuer"}
      </Button>
    </form>
  );
}
