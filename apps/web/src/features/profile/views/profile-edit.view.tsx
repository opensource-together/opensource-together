"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";

import useAuth from "@/features/auth/hooks/use-auth.hook";

import ProfileError from "../components/error-ui/profile-error.component";
import SkeletonProfileView from "../components/skeletons/skeleton-profile-view.component";
import ProfileEditMain from "../forms/profile-edit-main.form";
import ProfileSidebarEditForm from "../forms/profile-sidebar-edit.form";
import { useProfileUpdate } from "../hooks/use-profile.hook";
import { ProfileSchema, profileSchema } from "../validations/profile.schema";

export default function ProfileEditView() {
  const { currentUser, isLoading, isError } = useAuth();
  const { updateProfile, isUpdating } = useProfileUpdate();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [shouldDeleteImage, setShouldDeleteImage] = useState(false);

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      avatarUrl: currentUser?.avatarUrl || "",
      username: currentUser?.username || "",
      jobTitle: currentUser?.jobTitle || "",
      bio: currentUser?.bio || "",
      techStacks: currentUser?.techStacks?.map((tech) => tech.id) || [],
      socialLinks: currentUser?.socialLinks || {
        github: "",
        discord: "",
        twitter: "",
        linkedin: "",
        website: "",
      },
    },
  });

  const handleImageSelect = (file: File | null) => {
    if (file) {
      setSelectedImageFile(file);
      setShouldDeleteImage(false);
    } else {
      setSelectedImageFile(null);
      setShouldDeleteImage(true);
    }
  };

  const onSubmit = form.handleSubmit(async (data) => {
    updateProfile({
      updateData: {
        ...data,
        avatarUrl: currentUser?.avatarUrl || "",
      },
      avatarFile: selectedImageFile || undefined,
      shouldDeleteAvatar: shouldDeleteImage,
    });
  });

  if (isLoading) return <SkeletonProfileView />;
  if (isError || !currentUser) return <ProfileError />;

  return (
    <TwoColumnLayout
      sidebar={<ProfileSidebarEditForm profile={currentUser} form={form} />}
      hero={
        <ProfileEditMain
          profile={currentUser}
          form={form}
          onSubmit={onSubmit}
          onImageSelect={handleImageSelect}
          isUpdating={isUpdating}
        />
      }
    />
  );
}
