"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";

import ProfileEditForm from "../forms/profile-edit.form";
import ProfileSidebarEdit from "../forms/profile-sidebar-edit.component";
import { Profile } from "../types/profile.type";
import {
  ProfileSchema,
  UpdateProfileSchema,
} from "../validations/profile.schema";

interface ProfileEditMainProps {
  profile: Profile;
}

export default function ProfileEditMain({ profile }: ProfileEditMainProps) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      avatarUrl: profile.avatarUrl || "",
      name: profile.name || "",
      title: profile.title || "",
      bio: profile.bio || "",
      techStacks: profile.techStacks?.map((techStack) => techStack.name) || [],
      experiences: [],
      externalLinks:
        profile.links?.reduce(
          (acc, link) => {
            const linkType = link.type === "link" ? "website" : link.type;
            acc[linkType as keyof typeof acc] = link.url;
            return acc;
          },
          {} as {
            github?: string;
            discord?: string;
            twitter?: string;
            linkedin?: string;
            website?: string;
          }
        ) || {},
    },
  });

  const onSubmit = form.handleSubmit(async (data: ProfileSchema) => {
    console.info("Profile edit data:", data);
    // Redirection vers la page de profil principale
    router.push("/profile");
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-center">
          {/* Sidebar d'édition */}
          <div className="w-full lg:mr-30 lg:w-auto">
            <ProfileSidebarEdit profile={profile} form={form} />
          </div>

          {/* Formulaire principal */}
          <div className="w-full lg:w-auto">
            <ProfileEditForm profile={profile} form={form} />
          </div>
        </div>

        {/* Action Buttons - Centrés en bas */}
        <div className="mt-8 mb-80 flex justify-end gap-3">
          <Link href="/profile">
            <Button variant="outline">Annuler</Button>
          </Link>
          <Button type="submit">Confirmer</Button>
        </div>
      </form>
    </Form>
  );
}
