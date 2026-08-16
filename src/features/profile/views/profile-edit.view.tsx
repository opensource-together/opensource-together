"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authKeys } from "@/features/auth/hooks/auth.keys";
import { useCurrentUserQuery } from "@/features/auth/hooks/auth.queries";
import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";
import { ErrorState } from "@/shared/components/ui/error-state";
import { getErrorMessage } from "@/shared/lib/get-error-message";

import SkeletonProfileView from "../components/skeletons/skeleton-profile-view.component";
import ProfileEditMain from "../forms/profile-edit-main.form";
import ProfileSidebarEditForm from "../forms/profile-sidebar-edit.form";
import {
  useUpdateProfileBannerMutation,
  useUpdateProfileLogoMutation,
  useUpdateProfileMutation,
} from "../hooks/profile.mutations";
import {
  type ProfileFormValues,
  profileSchema,
  toUpdateProfileInput,
} from "../validations/profile.schema";

export default function ProfileEditView() {
  const router = useRouter();
  const currentUserQuery = useCurrentUserQuery();
  const currentUser = currentUserQuery.data;
  const updateProfileMutation = useUpdateProfileMutation();
  const updateProfileLogoMutation = useUpdateProfileLogoMutation();
  const updateProfileBannerMutation = useUpdateProfileBannerMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(
    null
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      image: currentUser?.image || "",
      name: currentUser?.name || "",
      jobTitle: currentUser?.jobTitle || "",
      bio: currentUser?.bio || "",
      userTechStacks: currentUser?.userTechStacks?.map((tech) => tech.id) || [],
      userCategories:
        currentUser?.userCategories?.map((category) => category.id) || [],
      experiences:
        currentUser?.userExperiences?.map((e) => ({
          title: e.title,
          startAt: e.startAt,
          endAt: e.endAt ?? null,
          url: e.url ?? undefined,
        })) || [],
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
      userCategories:
        currentUser?.userCategories?.map((category) => category.id) || [],
      experiences:
        currentUser?.userExperiences?.map((e) => ({
          title: e.title,
          startAt: e.startAt,
          endAt: e.endAt ?? null,
          url: e.url ?? undefined,
        })) || [],
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

  const handleBannerSelect = (file: File | null) => {
    setSelectedBannerFile(file);
  };

  const onSubmit = form.handleSubmit(async (data) => {
    if (!currentUser) return;

    setIsSubmitting(true);
    try {
      await Promise.all([
        updateProfileMutation.mutateAsync({
          userId: currentUser.id,
          data: toUpdateProfileInput(data),
        }),
        selectedImageFile
          ? updateProfileLogoMutation.mutateAsync({
              userId: currentUser.id,
              file: selectedImageFile,
            })
          : Promise.resolve(),
        selectedBannerFile
          ? updateProfileBannerMutation.mutateAsync({
              userId: currentUser.id,
              file: selectedBannerFile,
            })
          : Promise.resolve(),
      ]);

      toast.success("Profile updated successfully");
      router.push("/profile/me");
    } catch (error) {
      toast.error(getErrorMessage(error, "Error updating your profile"));
    } finally {
      setIsSubmitting(false);
    }
  });

  if (currentUserQuery.isLoading) return <SkeletonProfileView />;
  if (currentUserQuery.isError || !currentUser)
    return (
      <ErrorState
        message="An error has occurred while loading the profile edit. Please try again later."
        queryKey={authKeys.currentUser()}
        className="mt-20 mb-28"
        buttonText="Back to homepage"
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
          onBannerSelect={handleBannerSelect}
          isUpdating={isSubmitting}
        />
      }
    />
  );
}
