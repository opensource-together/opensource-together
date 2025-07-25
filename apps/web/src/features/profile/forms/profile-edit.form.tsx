"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AvatarUpload } from "@/shared/components/ui/avatar-upload";
import { Button } from "@/shared/components/ui/button";
import { Combobox } from "@/shared/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { InputWithIcon } from "@/shared/components/ui/input-with-icon";
import { Textarea } from "@/shared/components/ui/textarea";
import { useTechStack } from "@/shared/hooks/use-tech-stack.hook";
import logger from "@/shared/logger";

import { useProfileUpdate } from "../hooks/use-profile-update.hook";
import { Profile } from "../types/profile.type";
import { ProfileSchema, profileSchema } from "../validations/profile.schema";

interface ProfileEditFormProps {
  profile: Profile;
}

export default function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const { updateProfile, isUpdating } = useProfileUpdate();
  const { techStackOptions, isLoading: techStacksLoading } = useTechStack();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      avatarUrl: profile.avatarUrl || undefined,
      name: profile.name || "",
      title: profile.jobTitle || "",
      bio: profile.bio || "",
      techStacks: profile.techStacks?.map((techStack) => techStack.id) || [],
      socialLinks: profile.socialLinks || {},
    },
  });

  const { control } = form;

  const handleAvatarSelect = (file: File | null) => {
    setSelectedImageFile(file);
  };

  const onSubmit = form.handleSubmit(async (data: ProfileSchema) => {
    logger.info("Profile edit data:", data);
  });

  return (
    <div className="mx-auto mb-[200px] max-w-2xl">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
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
                      onFileSelect={handleAvatarSelect}
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
            control={form.control}
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

          {/* Bio */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
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

          {/* Tech Stack */}
          <FormField
            control={control}
            name="techStacks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technologies (max 10)</FormLabel>
                <FormControl>
                  <Combobox
                    options={techStackOptions}
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder={
                      techStacksLoading
                        ? "Chargement des technologies..."
                        : "Ajouter des technologies..."
                    }
                    searchPlaceholder="Rechercher une technologie..."
                    emptyText="Aucune technologie trouvée."
                    disabled={techStacksLoading}
                    maxSelections={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* External Links */}
          <div className="flex flex-col gap-4">
            <FormLabel>Liens sociaux</FormLabel>
            <FormField
              control={control}
              name="socialLinks.github"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithIcon
                      icon="github"
                      placeholder="https://github.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="socialLinks.discord"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithIcon
                      icon="discord"
                      placeholder="https://discord.gg/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="socialLinks.twitter"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithIcon
                      icon="twitter"
                      placeholder="https://x.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="socialLinks.linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithIcon
                      icon="linkedin"
                      placeholder="https://linkedin.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="socialLinks.website"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithIcon
                      icon="link"
                      placeholder="https://..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Link href="/profile">
              <Button variant="outline">Annuler</Button>
            </Link>
            <Button type="submit" disabled={isUpdating}>
              Confirmer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
