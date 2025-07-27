"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { AvatarUpload } from "@/shared/components/ui/avatar-upload";
import { Button } from "@/shared/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Icon } from "@/shared/components/ui/icon";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

import { useProfileUpdate } from "../hooks/use-profile-update.hook";
import { Profile } from "../types/profile.type";
import { ProfileSchema } from "../validations/profile.schema";

interface ProfileEditFormProps {
  profile: Profile;
  form: UseFormReturn<ProfileSchema>;
}

export default function ProfileEditForm({
  profile,
  form,
}: ProfileEditFormProps) {
  const [newExperience, setNewExperience] = useState("");
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<
    number | null
  >(null);
  const [editingExperienceText, setEditingExperienceText] = useState("");

  const { control, setValue, watch } = form;
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
    if (editingExperienceText.trim() && editingExperienceIndex !== null) {
      const updatedExperiences = [...experiences];
      updatedExperiences[editingExperienceIndex] = {
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
    <div className="w-[639px]">
      <div className="space-y-8">
        {/* Profile Picture */}
        <div className="space-y-2">
          <FormField
            control={control}
            name="avatarUrl"
            render={() => (
              <FormItem>
                <FormLabel>Choisir un avatar</FormLabel>
                <FormControl>
                  <AvatarUpload
                    onFileSelect={() => {}}
                    accept="image/*"
                    maxSize={1}
                    size="xl"
                    name={profile.name}
                    fallback={profile.name}
                    currentImageUrl={profile.avatarUrl}
                    className="mt-4"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Name */}
        <FormField
          control={control}
          name="name"
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

        {/* Title */}
        <FormField
          control={control}
          name="title"
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

        {/* Description */}
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

        {/* Separator */}
        <div className="h-[2px] w-full bg-black/5" />

        {/* Experiences */}
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
      </div>
    </div>
  );
}
