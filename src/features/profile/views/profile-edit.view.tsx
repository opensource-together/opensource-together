"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";
import { ErrorState } from "@/shared/components/ui/error-state";

import useAuth from "@/features/auth/hooks/use-auth.hook";

import SkeletonProfileView from "../components/skeletons/skeleton-profile-view.component";
import ProfileEditMain from "../forms/profile-edit-main.form";
import ProfileSidebarEditForm from "../forms/profile-sidebar-edit.form";
import {
  useProfileLogoUpdate,
  useProfileUpdate,
} from "../hooks/use-profile.hook";
import { ProfileSchema, profileSchema } from "../validations/profile.schema";

export default function ProfileEditView() {
  const { currentUser, isLoading, isError } = useAuth();
  const { updateProfile, isUpdating } = useProfileUpdate();
  const { updateProfileLogo, isUpdatingLogo } = useProfileLogoUpdate(
    currentUser?.publicId || currentUser?.id || ""
  );
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      image: currentUser?.image || "",
      name: currentUser?.name || "",
      jobTitle: currentUser?.jobTitle || "",
      bio: currentUser?.bio || "",
      userTechStacks: currentUser?.userTechStacks?.map((tech) => tech.id) || [],
      githubUrl: currentUser?.githubUrl || "",
      gitlabUrl: currentUser?.gitlabUrl || "",
      discordUrl: currentUser?.discordUrl || "",
      twitterUrl: currentUser?.twitterUrl || "",
      linkedinUrl: currentUser?.linkedinUrl || "",
      websiteUrl: currentUser?.websiteUrl || "",
    },
  });

  useEffect(() => {
    if (!currentUser) return;
    form.reset({
      image: currentUser.image || "",
      name: currentUser.name || "",
      jobTitle: currentUser.jobTitle || "",
      bio: currentUser.bio || "",
      userTechStacks: currentUser?.userTechStacks?.map((tech) => tech.id) || [],
      githubUrl: currentUser.githubUrl || "",
      gitlabUrl: currentUser.gitlabUrl || "",
      discordUrl: currentUser.discordUrl || "",
      twitterUrl: currentUser.twitterUrl || "",
      linkedinUrl: currentUser.linkedinUrl || "",
      websiteUrl: currentUser.websiteUrl || "",
    });
  }, [currentUser, form]);

  const handleImageSelect = (file: File | null) => {
    setSelectedImageFile(file);
  };

  const onSubmit = form.handleSubmit(async (data) => {
    const id = currentUser?.publicId || currentUser?.id || "";
    updateProfile({ id, updateData: data });
    if (selectedImageFile) {
      updateProfileLogo(selectedImageFile);
    }
  });

  if (isLoading) return <SkeletonProfileView />;
  if (isError || !currentUser)
    return (
      <ErrorState
        message="An error has occurred while loading the profile edit. Please try again later."
        queryKey={["user/me"]}
        className="mt-20 mb-28"
        buttonText="Back to projects"
        href="/"
      />
    );

  return (
    <TwoColumnLayout
      sidebar={<ProfileSidebarEditForm profile={currentUser} form={form} />}
      hero={
        <ProfileEditMain
          profile={currentUser}
          form={form}
          onSubmit={onSubmit}
          onImageSelect={handleImageSelect}
          isUpdating={isUpdating || isUpdatingLogo}
        />
      }
    />
  );
}
