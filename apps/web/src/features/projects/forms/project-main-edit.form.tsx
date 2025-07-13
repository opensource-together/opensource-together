import Link from "next/link";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { AvatarUpload } from "@/shared/components/ui/avatar-upload";
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

import { Project } from "../types/project.type";
import { ProjectSchema } from "../validations/project.schema";

interface ProjectMainEditFormProps {
  project: Project;
  form: UseFormReturn<ProjectSchema>;
  onSubmit: () => void;
  onImageSelect: (file: File | null) => void;
  isUpdating: boolean;
}

export default function ProjectMainEditForm({
  project,
  form,
  onSubmit,
  onImageSelect,
  isUpdating,
}: ProjectMainEditFormProps) {
  const { control, watch, setValue } = form;
  const [newFeature, setNewFeature] = useState("");
  const [newGoal, setNewGoal] = useState("");

  const keyFeatures = watch("keyFeatures") || [];
  const projectGoals = watch("projectGoals") || [];

  const addFeature = () => {
    if (newFeature.trim()) {
      setValue("keyFeatures", [...keyFeatures, { title: newFeature.trim() }]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setValue(
      "keyFeatures",
      keyFeatures.filter((_, i) => i !== index)
    );
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setValue("projectGoals", [...projectGoals, { goal: newGoal.trim() }]);
      setNewGoal("");
    }
  };

  const removeGoal = (index: number) => {
    setValue(
      "projectGoals",
      projectGoals.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="flex w-full flex-col gap-8 lg:max-w-xl">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
          <FormField
            control={control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Choisir un avatar</FormLabel>
                <FormControl>
                  <AvatarUpload
                    onFileSelect={onImageSelect}
                    accept="image/*"
                    maxSize={1}
                    size="xl"
                    name={project.title}
                    fallback={project.title}
                    className="mt-4"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title */}
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Titre</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nom du projet" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Description du projet"
                    className="h-[80px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* separator */}
          <div className="mt-10 h-[2px] w-full bg-black/3" />

          {/* Key Features */}
          <FormField
            control={control}
            name="keyFeatures"
            render={() => (
              <FormItem>
                <FormLabel
                  required
                  tooltip="Listez les principales fonctionnalités que votre projet propose ou proposera. Cela aide les développeurs à identifier les projets correspondant à leurs compétences."
                >
                  Fonctionnalités Clés
                </FormLabel>
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
                      {keyFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex-1 rounded-md border border-black/5 bg-gray-50 p-2 text-sm">
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
          {/* Project Goals */}
          <FormField
            control={control}
            name="projectGoals"
            render={() => (
              <FormItem>
                <FormLabel
                  required
                  tooltip="Décrivez les buts et résultats attendus de votre projet. Cela permet aux utilisateurs de découvrir votre projet selon leurs centres d'intérêt."
                >
                  Objectifs du projet
                </FormLabel>
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
                      {projectGoals.map((goal, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex-1 rounded-md border border-black/5 bg-gray-50 p-2 text-sm">
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

          <div className="mt-10 flex justify-end gap-2">
            <Link href={`/projects/${project.id}`}>
              <Button variant="outline" disabled={isUpdating}>
                Annuler
              </Button>
            </Link>
            <Button onClick={onSubmit} disabled={isUpdating}>
              {isUpdating ? "Enregistrement..." : "Confirmer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
