"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import BreadcrumbComponent from "@/shared/components/shared/Breadcrumb";

import { useProfileUpdate } from "../hooks/use-profile.hook";
import { Profile } from "../types/profile.type";
import { ProfileSchema, profileSchema } from "../validations/profile.schema";
import ProfileEditMain from "./profile-edit-main.form";
import ProfileSidebarEditForm from "./profile-sidebar-edit.form";

interface ProfileEditFormProps {
  profile: Profile;
}

export default function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const { updateProfile, isUpdating } = useProfileUpdate();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [shouldDeleteImage, setShouldDeleteImage] = useState(false);

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      avatarUrl: profile.avatarUrl || "",
      username: profile.username || "",
      jobTitle: profile.jobTitle || "",
      bio: profile.bio || "",
      techStacks: profile.techStacks?.map((tech) => tech.id) || [],
      experiences:
        profile.experiences?.map((experience) => ({
          experience: experience.position,
        })) || [],
      socialLinks: profile.socialLinks || {},
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
        avatarUrl: profile.avatarUrl || "",
      },
      avatarFile: selectedImageFile || undefined,
      shouldDeleteAvatar: shouldDeleteImage,
    });
  });

  const breadcrumbItems = [
    {
      label: "Découvrir",
      href: "/",
      isActive: false,
    },
    {
      label: profile.username || "Profile",
      isActive: true,
    },
  ];

  return (
    <>
      <div>
        <BreadcrumbComponent items={breadcrumbItems} className="mb-7" />
        <ProfileSidebarEditForm profile={profile} form={form} />
      </div>
      <ProfileEditMain
        profile={profile}
        form={form}
        onSubmit={onSubmit}
        onImageSelect={handleImageSelect}
        isUpdating={isUpdating}
      />
    </>
  );
}
