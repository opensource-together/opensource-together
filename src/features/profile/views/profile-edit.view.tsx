"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useAuth from "@/features/auth/hooks/use-auth.hook";
import TwoColumnLayout from "@/shared/components/layout/two-column-layout.component";
import { ErrorState } from "@/shared/components/ui/error-state";
import { getErrorMessage } from "@/shared/lib/get-error-message";

import SkeletonProfileView from "../components/skeletons/skeleton-profile-view.component";
import ProfileEditMain from "../forms/profile-edit-main.form";
import ProfileSidebarEditForm from "../forms/profile-sidebar-edit.form";
import {
  useProfileBannerUpdate,
  useProfileLogoUpdate,
  useProfileUpdate,
} from "../hooks/use-profile.hook";
import {
  type ProfileSchema,
  profileSchema,
} from "../validations/profile.schema";

export default function ProfileEditView() {
  const router = useRouter();
  const { currentUser, isLoading, isError } = useAuth();
  const updateProfileMutation = useProfileUpdate();
  const updateProfileLogoMutation = useProfileLogoUpdate(currentUser?.id || "");
  const updateProfileBannerMutation = useProfileBannerUpdate(
    currentUser?.id || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(
    null
  );

  const form = useForm<ProfileSchema>({
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
          id: currentUser.id,
          updateData: data,
        }),
        selectedImageFile
          ? updateProfileLogoMutation.mutateAsync(selectedImageFile)
          : Promise.resolve(),
        selectedBannerFile
          ? updateProfileBannerMutation.mutateAsync(selectedBannerFile)
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

  if (isLoading) return <SkeletonProfileView />;
  if (isError || !currentUser)
    return (
      <ErrorState
        message="An error has occurred while loading the profile edit. Please try again later."
        queryKey={["user", "me"]}
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
