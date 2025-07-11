"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

import { FormNavigationButtons } from "../../components/stepper/stepper-navigation-buttons.component";
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

  const form = useForm<StepOneFormData>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      title: formData.title || "",
      shortDescription: formData.shortDescription || "",
      keyFeatures: formData.keyFeatures || [],
      projectGoals: formData.projectGoals || [],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const {
    fields: keyFeatureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control,
    name: "keyFeatures",
  });

  const {
    fields: projectGoalFields,
    append: appendGoal,
    remove: removeGoal,
  } = useFieldArray({
    control,
    name: "projectGoals",
  });

  const addFeature = () => {
    if (newFeature.trim()) {
      appendFeature({ title: newFeature.trim() });
      setNewFeature("");
    }
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      appendGoal({ goal: newGoal.trim() });
      setNewGoal("");
    }
  };

  const onSubmit = handleSubmit((data) => {
    updateProjectInfo({
      title: data.title,
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
    <Form {...form}>
      <form className="flex w-full flex-col gap-5" onSubmit={onSubmit}>
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Nom du projet</FormLabel>
              <FormControl>
                <Input placeholder="Nom du projet" {...field} maxLength={100} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez votre projet"
                  {...field}
                  maxLength={250}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="keyFeatures"
          render={() => (
            <FormItem>
              <FormLabel required>Fonctionnalités clés</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Ajouter une fonctionnalité"
                      className="pr-20"
                    />
                    <Button
                      type="button"
                      onClick={addFeature}
                      variant="secondary"
                      className="absolute top-1/2 right-1 h-7 -translate-y-1/2"
                    >
                      Ajouter
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {keyFeatureFields.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex-1 rounded-md bg-gray-50 p-2">
                          {feature.title}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => removeFeature(index)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="projectGoals"
          render={() => (
            <FormItem>
              <FormLabel required>Objectifs du projet</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Input
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      placeholder="Ajouter un objectif"
                      className="pr-20"
                    />
                    <Button
                      type="button"
                      onClick={addGoal}
                      variant="secondary"
                      className="absolute top-1/2 right-1 h-7 -translate-y-1/2"
                    >
                      Ajouter
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {projectGoalFields.map((goal, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex-1 rounded-md bg-gray-50 p-2">
                          {goal.goal}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => removeGoal(index)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
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
