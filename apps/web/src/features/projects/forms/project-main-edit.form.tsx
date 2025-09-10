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
import { MultipleImageUpload } from "@/shared/components/ui/multiple-image-upload";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";

import { Project } from "../types/project.type";
import { ProjectSchema } from "../validations/project.schema";

interface ProjectMainEditFormProps {
  project: Project;
  form: UseFormReturn<ProjectSchema>;
  onSubmit: () => void;
  onImageSelect: (file: File | null) => void;
  isUpdating: boolean;
  onCoverFilesChange?: (files: File[]) => void;
  onRemoveExistingCover?: (imageUrl: string, index: number) => void;
  currentCoverImages?: string[];
}

export default function ProjectMainEditForm({
  project,
  form,
  onSubmit,
  onImageSelect,
  isUpdating,
  onCoverFilesChange,
  onRemoveExistingCover,
  currentCoverImages,
}: ProjectMainEditFormProps) {
  const { control, watch, setValue } = form;
  const [newFeature, setNewFeature] = useState("");
  const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(
    null
  );
  const [editingFeatureText, setEditingFeatureText] = useState("");

  const keyFeatures = watch("keyFeatures") || [];

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

  return (
    <div className="mb-30 flex w-full flex-col gap-8 lg:max-w-xl">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8 lg:w-[648px]">
          <FormField
            control={control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel className="text-primary mb-2 text-sm font-medium">
                  Choisir un avatar
                </FormLabel>
                <FormControl>
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

          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  required
                  className="text-primary mb-2 text-sm font-medium"
                >
                  Titre
                </FormLabel>
                <FormControl className="mt-[-6px]">
                  <Input
                    {...field}
                    placeholder="Nom du projet"
                    className="text-primary bg-white text-sm"
                  />
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
                <FormLabel
                  required
                  className="text-primary mb-2 text-sm font-medium"
                >
                  Description
                </FormLabel>
                <FormControl className="mt-[-6px]">
                  <Textarea
                    {...field}
                    placeholder="Description du projet"
                    className="text-primary min-h-[120px] w-full resize-none bg-white text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={control}
            name="coverImages"
            render={() => (
              <FormItem>
                <FormLabel
                  tooltip="Ajoutez jusqu'à 4 images de couverture."
                  className="text-primary mb-2 text-sm font-medium"
                >
                  Images de couverture
                </FormLabel>
                <FormControl className="mt-[-6px]">
                  <MultipleImageUpload
                    accept="image/*"
                    maxFiles={4}
                    maxSize={5}
                    currentImages={
                      currentCoverImages ?? project.coverImages ?? []
                    }
                    onFilesChange={(files) => onCoverFilesChange?.(files)}
                    onRemoveCurrentImage={(imageUrl, index) =>
                      onRemoveExistingCover?.(imageUrl, index)
                    }
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
                <FormLabel
                  required
                  tooltip="Listez les principales fonctionnalités que votre projet propose ou proposera. Cela aide les développeurs à identifier les projets correspondant à leurs compétences."
                  className="text-primary mb-2 text-sm font-medium"
                >
                  Fonctionnalités Clés
                </FormLabel>
                <FormControl className="mt-[-6px]">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Ajouter une fonctionnalité"
                        className="placeholder:text-muted-foreground flex-1 bg-white text-sm lg:w-[547px]"
                      />
                      <Button
                        type="button"
                        onClick={addFeature}
                        variant="outline"
                      >
                        Ajouter
                      </Button>
                    </div>
                    <div className="flex w-full flex-col gap-2 lg:w-full">
                      {keyFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="text-primary flex flex-1 items-center justify-between rounded-md border border-black/5 bg-white px-4 py-2 text-xs leading-relaxed shadow-xs">
                            {editingFeatureIndex === index ? (
                              <div className="flex flex-1 items-center gap-2">
                                <Input
                                  value={editingFeatureText}
                                  onChange={(e) =>
                                    setEditingFeatureText(e.target.value)
                                  }
                                  className="text-primary flex-1 bg-white text-xs"
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
                                    <Icon
                                      name="pencil"
                                      size="xs"
                                      className="size-2.5"
                                    />
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
                                    <Icon
                                      name="trash"
                                      size="xs"
                                      className="size-2.5"
                                    />
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

          <div className="flex w-full justify-end gap-4">
            <Link href={`/projects/${project.id}`}>
              <Button variant="secondary" disabled={isUpdating}>
                Retour
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
