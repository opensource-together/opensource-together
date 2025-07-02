"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

import { FormNavigationButtons } from "../../components/form-navigation-buttons.component";
import { useProjectCreateStore } from "../../stores/project-create.store";
import {
  StepOneFormData,
  stepOneSchema,
} from "../../validations/project-stepper.schema";

export function StepOneForm() {
  const router = useRouter();
  const { formData, updateProjectInfo } = useProjectCreateStore();
  const [newFeature, setNewFeature] = useState("");
  const [newGoal, setNewGoal] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StepOneFormData>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      projectName: formData.projectName || "",
      shortDescription: formData.shortDescription || "",
      keyFeatures: Array.isArray(formData.keyFeatures)
        ? formData.keyFeatures
        : [],
      projectGoals: Array.isArray(formData.projectGoals)
        ? formData.projectGoals
        : [],
    },
  });

  const shortDescription = watch("shortDescription");
  const keyFeatures = watch("keyFeatures");
  const projectGoals = watch("projectGoals");

  // Ensure arrays are always arrays
  const safeKeyFeatures = Array.isArray(keyFeatures) ? keyFeatures : [];
  const safeProjectGoals = Array.isArray(projectGoals) ? projectGoals : [];

  const addFeature = () => {
    if (newFeature.trim()) {
      setValue("keyFeatures", [
        ...safeKeyFeatures,
        { title: newFeature.trim() },
      ]);
      setNewFeature("");
    }
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setValue("projectGoals", [...safeProjectGoals, { goal: newGoal.trim() }]);
      setNewGoal("");
    }
  };

  const removeFeature = (index: number) => {
    setValue(
      "keyFeatures",
      safeKeyFeatures.filter((_, i) => i !== index)
    );
  };

  const removeGoal = (index: number) => {
    setValue(
      "projectGoals",
      safeProjectGoals.filter((_, i) => i !== index)
    );
  };

  const onSubmit = handleSubmit((data) => {
    updateProjectInfo({
      projectName: data.projectName,
      shortDescription: data.shortDescription,
      keyFeatures: data.keyFeatures,
      projectGoals: data.projectGoals,
    });

    router.push("/projects/create/scratch/step-two");
  });

  const handlePrevious = () => {
    router.push("/projects/create");
  };

  return (
    <form className="flex w-full flex-col gap-5" onSubmit={onSubmit}>
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
            {shortDescription?.length || 0}/250
          </span>
        </div>
        <Textarea
          {...register("shortDescription")}
          placeholder="Décrivez votre projet"
          maxLength={250}
        />
        {errors.shortDescription && (
          <p className="mt-1 text-sm text-red-500">
            {errors.shortDescription.message}
          </p>
        )}
      </div>

      <div>
        <Label>Fonctionnalités clés</Label>
        <div className="flex gap-2">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Intégration Docker/Kubernetes"
          />
          <Button type="button" onClick={addFeature}>
            Ajouter
          </Button>
        </div>
        <ul className="mt-2 space-y-2">
          {safeKeyFeatures.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <span>{feature.title}</span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeFeature(index)}
              >
                Supprimer
              </Button>
            </li>
          ))}
        </ul>
        {errors.keyFeatures && (
          <p className="mt-1 text-sm text-red-500">
            {errors.keyFeatures.message}
          </p>
        )}
      </div>

      <div>
        <Label>Objectifs du projet</Label>
        <div className="flex gap-2">
          <Input
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Suivi des progrès personnalisé"
          />
          <Button type="button" onClick={addGoal}>
            Ajouter
          </Button>
        </div>
        <ul className="mt-2 space-y-2">
          {safeProjectGoals.map((goal, index) => (
            <li key={index} className="flex items-center gap-2">
              <span>{goal.goal}</span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeGoal(index)}
              >
                Supprimer
              </Button>
            </li>
          ))}
        </ul>
        {errors.projectGoals && (
          <p className="mt-1 text-sm text-red-500">
            {errors.projectGoals.message}
          </p>
        )}
      </div>

      <FormNavigationButtons
        onPrevious={handlePrevious}
        previousLabel="Retour"
        nextLabel="Suivant"
        isLoading={isSubmitting}
        nextType="submit"
      />
    </form>
  );
}
