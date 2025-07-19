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
import Icon from "@/shared/components/ui/icon";
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
  const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(
    null
  );
  const [editingGoalIndex, setEditingGoalIndex] = useState<number | null>(null);
  const [editingFeatureText, setEditingFeatureText] = useState("");
  const [editingGoalText, setEditingGoalText] = useState("");

  const keyFeatures = watch("keyFeatures") || [];
  const projectGoals = watch("projectGoals") || [];

  const addFeature = () => {
    if (newFeature.trim()) {
      setValue("keyFeatures", [...keyFeatures, { feature: newFeature.trim() }]);
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

  const startEditingFeature = (index: number, text: string) => {
    setEditingFeatureIndex(index);
    setEditingFeatureText(text);
  };

  const saveEditingFeature = () => {
    if (editingFeatureIndex !== null) {
      const updatedFeatures = [...keyFeatures];
      updatedFeatures[editingFeatureIndex] = { feature: editingFeatureText };
      setValue("keyFeatures", updatedFeatures);
      setEditingFeatureIndex(null);
      setEditingFeatureText("");
    }
  };

  const cancelEditingFeature = () => {
    setEditingFeatureIndex(null);
    setEditingFeatureText("");
  };

  const startEditingGoal = (index: number, text: string) => {
    setEditingGoalIndex(index);
    setEditingGoalText(text);
  };

  const saveEditingGoal = () => {
    if (editingGoalIndex !== null) {
      const updatedGoals = [...projectGoals];
      updatedGoals[editingGoalIndex] = { goal: editingGoalText };
      setValue("projectGoals", updatedGoals);
      setEditingGoalIndex(null);
      setEditingGoalText("");
    }
  };

  const cancelEditingGoal = () => {
    setEditingGoalIndex(null);
    setEditingGoalText("");
  };

  return (
    <div className="mb-30 flex w-full flex-col gap-8 lg:max-w-xl">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
          <FormField
            control={control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Choisir un avatar</FormLabel>
                <FormControl>
                  <div className="w-full lg:w-[668px]">
                  <AvatarUpload
                    onFileSelect={onImageSelect}
                    accept="image/*"
                    maxSize={1}
                    size="xl"
                    name={project.title}
                    fallback={project.title}
                    className="mt-4"
                    currentImageUrl={project.image}
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
                  <Input
                    {...field}
                    placeholder="Nom du projet"
                    className="w-full lg:w-[668px]"
                  />
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
                    className="h-[80px] w-full lg:w-[668px]"
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
                    <div className="flex items-center gap-2">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Ajouter une fonctionnalité"
                        className="flex-1 lg:w-[566px]"
                      />
                      <Button
                        type="button"
                        onClick={addFeature}
                        variant="outline"
                      >
                        Ajouter
                      </Button>
                    </div>
                    <div className="flex w-full flex-col gap-2 lg:w-[668px]">
                      {keyFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex flex-1 items-center justify-between rounded-md border border-black/5 bg-white p-2 text-sm leading-relaxed shadow-xs">
                            {editingFeatureIndex === index ? (
                              <div className="flex flex-1 items-center gap-2">
                                <Input
                                  value={editingFeatureText}
                                  onChange={(e) =>
                                    setEditingFeatureText(e.target.value)
                                  }
                                  className="flex-1"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") saveEditingFeature();
                                    if (e.key === "Escape")
                                      cancelEditingFeature();
                                  }}
                                />
                                <Button
                                  onClick={saveEditingFeature}
                                  variant="ghost"
                                  size="icon"
                                >
                                  <Icon name="check" size="xs" />
                                </Button>
                                <Button
                                  onClick={cancelEditingFeature}
                                  variant="ghost"
                                  size="icon"
                                >
                                  <Icon name="cross" size="xs" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <span>{feature.feature}</span>
                                <div className="flex items-center gap-1">
                                  <Button
                                    onClick={() =>
                                      startEditingFeature(
                                        index,
                                        feature.feature
                                      )
                                    }
                                    variant="ghost"
                                    size="icon"
                                  >
                                    <Icon name="pencil" size="sm" />
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      removeFeature(index);
                                    }}
                                    variant="ghost"
                                    size="icon"
                                  >
                                    <Icon name="trash" size="sm" />
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
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
                    <div className="flex items-center gap-2">
                      <Input
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="Ajouter un objectif"
                        className="flex-1 lg:w-[566px]"
                      />
                      <Button type="button" onClick={addGoal} variant="outline">
                        Ajouter
                      </Button>
                    </div>
                    <div className="flex w-full flex-col gap-2 lg:w-[668px]">
                      {projectGoals.map((goal, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex flex-1 items-center justify-between rounded-md border border-black/5 bg-white p-2 text-sm leading-relaxed shadow-xs">
                            {editingGoalIndex === index ? (
                              <div className="flex flex-1 items-center gap-2">
                                <Input
                                  value={editingGoalText}
                                  onChange={(e) =>
                                    setEditingGoalText(e.target.value)
                                  }
                                  className="flex-1"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") saveEditingGoal();
                                    if (e.key === "Escape") cancelEditingGoal();
                                  }}
                                />
                                <Button
                                  onClick={saveEditingGoal}
                                  variant="ghost"
                                  size="icon"
                                >
                                  <Icon name="check" size="xs" />
                                </Button>
                                <Button
                                  onClick={cancelEditingGoal}
                                  variant="ghost"
                                  size="icon"
                                >
                                  <Icon name="cross" size="xs" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <span>{goal.goal}</span>
                                <div className="flex items-center gap-1">
                                  <Button
                                    onClick={() =>
                                      startEditingGoal(index, goal.goal)
                                    }
                                    variant="ghost"
                                    size="icon"
                                  >
                                    <Icon name="pencil" size="sm" />
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      removeGoal(index);
                                    }}
                                    variant="ghost"
                                    size="icon"
                                  >
                                    <Icon name="trash" size="sm" />
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-10 flex w-full justify-end gap-2 lg:w-[668px]">
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
