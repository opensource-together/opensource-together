"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { type UseFormReturn, useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";

import { AvatarUpload } from "@/shared/components/ui/avatar-upload";
import { BannerUpload } from "@/shared/components/ui/banner-upload";
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
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";

import type { Profile } from "../types/profile.type";
import {
  experienceSchema,
  type ProfileSchema,
} from "../validations/profile.schema";
import ExperienceModalForm from "./experience-modal.form";
import ProfileExperiencesEditor from "./profile-experiences-editor.form";

interface ProfileEditMainFormProps {
  profile: Profile;
  form: UseFormReturn<ProfileSchema>;
  onSubmit: () => void;
  onImageSelect: (file: File | null) => void;
  onBannerSelect: (file: File | null) => void;
  isUpdating: boolean;
}

type ExperienceFormData = z.infer<typeof experienceSchema>;

export default function ProfileEditMainForm({
  profile,
  form,
  onSubmit,
  onImageSelect,
  onBannerSelect,
  isUpdating,
}: ProfileEditMainFormProps) {
  const { control } = form;
  const experiencesArray = useFieldArray({
    control,
    name: "experiences" as const,
  });

  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const experienceForm = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: "",
      startAt: "",
      endAt: undefined,
      url: undefined,
    },
  });

  const handleOpenAddExperience = () => {
    setEditingIndex(null);
    experienceForm.reset({
      title: "",
      startAt: "",
      endAt: undefined,
      url: undefined,
    });
    setIsExperienceModalOpen(true);
  };

  const handleOpenEditExperience = (index: number) => {
    const experience = experiencesArray.fields[index];
    setEditingIndex(index);
    experienceForm.reset({
      title: experience.title || "",
      startAt: experience.startAt || "",
      endAt: experience.endAt ?? undefined,
      url: experience.url ?? undefined,
    });
    setIsExperienceModalOpen(true);
  };

  const handleCancelExperience = () => {
    setIsExperienceModalOpen(false);
    experienceForm.reset();
    setEditingIndex(null);
  };

  return (
    <div className="mb-30 flex w-full flex-col gap-8 lg:max-w-xl">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8 lg:w-[648px]">
          <FormField
            control={control}
            name="banner"
            render={() => (
              <FormItem>
                <FormLabel className="font-medium text-sm">Banner</FormLabel>
                <FormControl>
                  <BannerUpload
                    currentImageUrl={profile.banner}
                    onFileSelect={onBannerSelect}
                    accept="image/*"
                    maxSize={5}
                    updatedAt={profile.updatedAt}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Choose an avatar</FormLabel>
                <FormControl>
                  <AvatarUpload
                    currentImageUrl={profile.image}
                    onFileSelect={onImageSelect}
                    name={profile.name}
                    fallback={profile.name}
                    accept="image/*"
                    maxSize={5}
                    size="xl"
                    className="mt-4"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Your name"
                    className="text-sm"
                  />
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
                <FormLabel required>Job Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ex: Full Stack Developer"
                    className="text-sm"
                  />
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
                    placeholder="Tell us about yourself, your passions, your experience..."
                    className="min-h-[120px] w-full resize-none text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-10">
            <ProfileExperiencesEditor
              experiences={experiencesArray.fields.map((e) => ({
                title: e.title || "",
                startAt: e.startAt || "",
                endAt: (e.endAt as string | null | undefined) ?? null,
                url: (e.url as string | null | undefined) ?? null,
              }))}
              onAdd={handleOpenAddExperience}
              onEdit={handleOpenEditExperience}
              onRemove={(idx) => experiencesArray.remove(idx)}
              onReorder={(fromIndex, toIndex) => {
                experiencesArray.move(fromIndex, toIndex);
              }}
            />
          </div>

          <Separator className="mt-20" />

          <div className="sticky bottom-0 z-50 bg-background">
            <div className="-mx-4.5">
              <div className="flex items-center justify-end gap-4 px-6 py-4">
                <Link href="/profile/me">
                  <Button variant="secondary" disabled={isUpdating}>
                    Return
                  </Button>
                </Link>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Confirm"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>

      <ExperienceModalForm
        open={isExperienceModalOpen}
        onOpenChange={setIsExperienceModalOpen}
        title={editingIndex !== null ? "Edit Experience" : "Add Experience"}
        description={
          editingIndex !== null
            ? "Update your work experience details"
            : "Add a new work experience to your profile"
        }
        confirmText={editingIndex !== null ? "Update" : "Add"}
        cancelText="Cancel"
        onConfirm={(values) => {
          if (editingIndex !== null) {
            experiencesArray.update(editingIndex, values);
          } else {
            experiencesArray.append(values);
          }
          setIsExperienceModalOpen(false);
          experienceForm.reset();
        }}
        onCancel={handleCancelExperience}
        form={experienceForm}
      />
    </div>
  );
}
