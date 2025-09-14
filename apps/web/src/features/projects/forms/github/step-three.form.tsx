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
import Icon from "@/shared/components/ui/icon";
import { Input } from "@/shared/components/ui/input";
import { MultipleImageUpload } from "@/shared/components/ui/multiple-image-upload";
import { Textarea } from "@/shared/components/ui/textarea";

import { FormNavigationButtons } from "../../components/stepper/stepper-navigation-buttons.component";
import { useProjectCreateStore } from "../../stores/project-create.store";
import {
  StepOneFormData,
  stepOneSchema,
} from "../../validations/project-stepper.schema";

export function StepThreeForm() {
  const router = useRouter();
  const { formData, updateProjectInfo } = useProjectCreateStore();
  const [newFeature, setNewFeature] = useState("");
  const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(
    null
  );
  const [editingFeatureText, setEditingFeatureText] = useState("");
  const [coverImages, setCoverImages] = useState<File[]>(
    formData.coverImages || []
  );

  const repoTitle = formData.selectedRepository?.title || "";
  const repoDescription = formData.selectedRepository?.description || "";

  const form = useForm<StepOneFormData>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      title: repoTitle,
      description: repoDescription,
      keyFeatures: formData.keyFeatures || [],
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
    update: updateFeature,
  } = useFieldArray({
    control,
    name: "keyFeatures",
  });

  const addFeature = () => {
    if (newFeature.trim()) {
      appendFeature({ feature: newFeature.trim() });
      setNewFeature("");
    }
  };

  const startEditingFeature = (index: number, text: string) => {
    setEditingFeatureIndex(index);
    setEditingFeatureText(text);
  };

  const saveEditingFeature = () => {
    if (editingFeatureIndex !== null) {
      updateFeature(editingFeatureIndex, { feature: editingFeatureText });
      setEditingFeatureIndex(null);
      setEditingFeatureText("");
    }
  };

  const cancelEditingFeature = () => {
    setEditingFeatureIndex(null);
    setEditingFeatureText("");
  };

  const onSubmit = handleSubmit((data) => {
    updateProjectInfo({
      title: data.title,
      description: data.description,
      keyFeatures: data.keyFeatures,
      coverImages,
    });

    router.push("/projects/create/github/step-four");
  });

  const handlePrevious = () => {
    router.push("/projects/create/github/step-two");
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
          name="description"
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

        <FormItem>
          <FormLabel tooltip="Ajoutez jusqu'à 4 images de couverture pour présenter votre projet. Ces images seront affichées sur la page du projet.">
            Images de couverture
          </FormLabel>
          <FormControl>
            <MultipleImageUpload
              onFilesChange={setCoverImages}
              maxFiles={4}
              maxSize={5}
              accept="image/*"
            />
          </FormControl>
        </FormItem>

        <FormField
          control={control}
          name="keyFeatures"
          render={() => (
            <FormItem>
              <FormLabel
                required
                tooltip="Listez les principales fonctionnalités que votre projet propose ou proposera. Ex: Authentification utilisateurs, API REST, Dashboard administrateur, Notifications en temps réel..."
              >
                Fonctionnalités clés
              </FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Ajouter une fonctionnalité"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={addFeature}
                      variant="outline"
                    >
                      Ajouter
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {keyFeatureFields.map((feature, index) => (
                      <div key={feature.id} className="flex items-center gap-2">
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
                                    startEditingFeature(index, feature.feature)
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
