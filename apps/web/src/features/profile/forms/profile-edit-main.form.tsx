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
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";

import { Profile } from "../types/profile.type";
import { ProfileSchema } from "../validations/profile.schema";

interface ProfileEditMainFormProps {
  profile: Profile;
  form: UseFormReturn<ProfileSchema>;
  onSubmit: () => void;
  onImageSelect: (file: File | null) => void;
  isUpdating: boolean;
}

export default function ProfileEditMainForm({
  profile,
  form,
  onSubmit,
  onImageSelect,
  isUpdating,
}: ProfileEditMainFormProps) {
  const { control, watch, setValue } = form;
  const [newExperience, setNewExperience] = useState("");
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<
    number | null
  >(null);
  const [editingExperienceText, setEditingExperienceText] = useState("");

  const experiences = watch("experiences") || [];

  const addExperience = () => {
    if (newExperience.trim()) {
      setValue("experiences", [
        ...experiences,
        { experience: newExperience.trim() },
      ]);
      setNewExperience("");
    }
  };

  const removeExperience = (index: number) => {
    setValue(
      "experiences",
      experiences.filter((_, i) => i !== index)
    );
  };

  const startEditingExperience = (index: number, text: string) => {
    setEditingExperienceIndex(index);
    setEditingExperienceText(text);
  };

  const saveEditingExperience = () => {
    if (editingExperienceText.trim()) {
      const updatedExperiences = [...experiences];
      updatedExperiences[editingExperienceIndex!] = {
        experience: editingExperienceText.trim(),
      };
      setValue("experiences", updatedExperiences);
      setEditingExperienceIndex(null);
      setEditingExperienceText("");
    }
  };

  const cancelEditingExperience = () => {
    setEditingExperienceIndex(null);
    setEditingExperienceText("");
  };
  return (
    <div className="mb-30 flex w-full flex-col gap-8 lg:max-w-xl">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8 lg:w-[668px]">
          <FormField
            control={control}
            name="avatarUrl"
            render={() => (
              <FormItem>
                <FormLabel>Choisir un avatar</FormLabel>
                <FormControl>
                  <AvatarUpload
                    onFileSelect={onImageSelect}
                    accept="image/*"
                    maxSize={1}
                    size="2xl"
                    name={profile.username}
                    fallback={profile.username}
                    currentImageUrl={profile.avatarUrl}
                    className="mt-4"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Votre nom" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Développeur Full Stack" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Parlez-nous de vous, vos passions, votre expérience..."
                    className="min-h-[120px] w-full resize-none sm:w-[500px] md:w-[650px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={control}
            name="experiences"
            render={() => (
              <FormItem>
                <FormLabel>Expériences</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Input
                        value={newExperience}
                        onChange={(e) => setNewExperience(e.target.value)}
                        placeholder="Ajouter un objectif"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addExperience();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={addExperience}
                        variant="outline"
                      >
                        Ajouter
                      </Button>
                    </div>
                    <div className="flex w-full flex-col gap-2">
                      {experiences.map((experience, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex flex-1 items-center justify-between rounded-md border border-black/5 bg-white p-2 text-sm leading-relaxed shadow-xs">
                            {editingExperienceIndex === index ? (
                              <div className="flex flex-1 items-center gap-2">
                                <Input
                                  value={editingExperienceText}
                                  onChange={(e) =>
                                    setEditingExperienceText(e.target.value)
                                  }
                                  className="flex-1"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter")
                                      saveEditingExperience();
                                    if (e.key === "Escape")
                                      cancelEditingExperience();
                                  }}
                                />
                                <Button
                                  onClick={saveEditingExperience}
                                  variant="ghost"
                                  size="icon"
                                >
                                  <Icon name="check" size="xs" />
                                </Button>
                                <Button
                                  onClick={cancelEditingExperience}
                                  variant="ghost"
                                  size="icon"
                                >
                                  <Icon name="cross" size="xs" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <span>{experience.experience}</span>
                                <div className="flex items-center gap-1">
                                  <Button
                                    onClick={() =>
                                      startEditingExperience(
                                        index,
                                        experience.experience
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
                                      removeExperience(index);
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

          <div className="mt-10 flex w-full justify-end gap-2">
            <Link href="/profile/me">
              <Button variant="outline" disabled={isUpdating}>
                Annuler
              </Button>
            </Link>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Enregistrement..." : "Confirmer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
