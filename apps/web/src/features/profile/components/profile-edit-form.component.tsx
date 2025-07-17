"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Avatar } from "@/shared/components/ui/avatar";
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
import Icon from "@/shared/components/ui/icon";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useTechStack } from "@/shared/hooks/use-tech-stack.hook";

import { Profile } from "../types/profile.type";
import { profileEditSchema } from "../validations/profile-edit.schema";

interface ProfileEditFormProps {
  profile: Profile;
}

export default function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(profile.avatarUrl || "");
  const { techStackOptions, isLoading: techStacksLoading } = useTechStack();

  const form = useForm({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      avatarUrl: profile.avatarUrl || "",
      name: profile.name || "",
      company: profile.company || "",
      bio: profile.bio || "",
      techStacks: profile.skills?.map((skill) => skill.name) || [],
      externalLinks: {
        linkedin:
          profile.links?.find((link) => link.type === "linkedin")?.url || "",
        twitter:
          profile.links?.find((link) => link.type === "twitter")?.url || "",
        website: profile.links?.find((link) => link.type === "link")?.url || "",
      },
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue("avatarUrl", url);
    }
  };

  const onSubmit = (data: any) => {
    console.log("Profile edit data:", data);
    // TODO: Implement profile update logic
  };

  return (
    <div className="mx-auto mb-[200px] max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Picture */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-black">
              Photo de profil
            </Label>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar
                  src={previewUrl}
                  name={profile.name}
                  alt={profile.name}
                  size="2xl"
                />
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-black/70">
                    JPG ou PNG, 1MB Max
                  </div>
                </div>
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageUpload}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  id="avatar-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  asChild
                >
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    Importer <Icon name="download" size="xs" />
                  </label>
                </Button>
              </div>
            </div>
          </div>

          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-black">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Votre nom complet"
                    className="w-full sm:w-[500px] md:w-[650px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title */}
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-black">
                  Title
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Votre titre ou poste"
                    className="w-full sm:w-[500px] md:w-[650px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-black">
                  Description
                </FormLabel>
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
            control={form.control}
            name="techStacks"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-black">
                  Tech Stack
                </FormLabel>
                <FormControl>
                  <div className="w-full sm:w-[500px] md:w-[650px]">
                    <Combobox
                      options={techStackOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Choisir des technologies"
                      searchPlaceholder="Rechercher une technologie..."
                      emptyText="Aucune technologie trouvée."
                      disabled={techStacksLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* External Links */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-black">
              Liens externes
            </Label>

            {/* LinkedIn */}
            <FormField
              control={form.control}
              name="externalLinks.linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative w-full sm:w-[500px] md:w-[650px]">
                      <div className="absolute top-1/2 left-3 -translate-y-1/2">
                        <Icon name="linkedin" size="sm" />
                      </div>
                      <Input
                        {...field}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Twitter */}
            <FormField
              control={form.control}
              name="externalLinks.twitter"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative w-full sm:w-[500px] md:w-[650px]">
                      <div className="absolute top-1/2 left-3 -translate-y-1/2">
                        <Icon name="twitter" size="sm" />
                      </div>
                      <Input
                        {...field}
                        placeholder="https://x.com/username"
                        className="w-full pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Website */}
            <FormField
              control={form.control}
              name="externalLinks.website"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative w-full sm:w-[500px] md:w-[650px]">
                      <div className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-gray-500">
                        https://
                      </div>
                      <Input
                        {...field}
                        placeholder="yourwebsite.com"
                        className="w-full pl-[70px]"
                      />
                    </div>
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
            <Button type="submit">Confirmer</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
