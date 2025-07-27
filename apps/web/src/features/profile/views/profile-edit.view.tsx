"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";

import useAuth from "@/features/auth/hooks/use-auth.hook";

import ProfileError from "../components/error-ui/profile-error.component";
import SkeletonProfileView from "../components/skeletons/skeleton-profile-view.component";
import ProfileEditForm from "../forms/profile-edit.form";
import ProfileSidebarEdit from "../forms/profile-sidebar-edit.component";
import {
  ProfileSchema,
  UpdateProfileSchema,
} from "../validations/profile.schema";

export default function ProfileEditView() {
  const { currentUser, isLoading, isError } = useAuth();
  const router = useRouter();

  if (isLoading) return <SkeletonProfileView />;
  if (isError || !currentUser) return <ProfileError />;

  const form = useForm({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      avatarUrl: currentUser.avatarUrl || "",
      name: currentUser.name || "",
      title: currentUser.title || "",
      bio: currentUser.bio || "",
      techStacks:
        currentUser.techStacks?.map((techStack) => techStack.name) || [],
      experiences: [],
      externalLinks:
        currentUser.links?.reduce(
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
    <div className="mx-auto mt-12 max-w-[1300px]">
      <div className="mx-auto mt-2 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40">
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-center">
              {/* Sidebar d'édition */}
              <div className="w-full lg:mr-30 lg:w-auto">
                <ProfileSidebarEdit profile={currentUser} form={form} />
              </div>

              {/* Formulaire principal */}
              <div className="w-full lg:w-auto">
                <ProfileEditForm profile={currentUser} form={form} />
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
      </div>
    </div>
  );
}
