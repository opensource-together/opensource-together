import Link from "next/link";
import { UseFormReturn } from "react-hook-form";

import { AvatarUpload } from "@/shared/components/ui/avatar-upload";
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

import { Profile } from "../types/profile.type";
import { ProfileSchema } from "../validations/profile.schema";

interface ProfileEditMainFormProps {
  profile: Profile;
  form: UseFormReturn<ProfileSchema>;
  onSubmit: () => void;
  onImageSelect: (file: File | null) => void;
  isUpdating: boolean;
}

export default function ProfileEditMainForm({
  profile,
  form,
  onSubmit,
  onImageSelect,
  isUpdating,
}: ProfileEditMainFormProps) {
  const { control } = form;

  return (
    <div className="mb-30 flex w-full flex-col gap-8 lg:max-w-xl">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8 lg:w-[648px]">
          <FormField
            control={control}
            name="avatarUrl"
            render={() => (
              <FormItem>
                <FormLabel>Choisir un avatar</FormLabel>
                <FormControl>
                  <AvatarUpload
                    currentImageUrl={profile.avatarUrl}
                    onFileSelect={onImageSelect}
                    name={profile.username}
                    fallback={profile.username}
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Votre nom"
                    className="bg-white text-sm"
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
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ex: Développeur Full Stack"
                    className="bg-white text-sm"
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
                    placeholder="Parlez-nous de vous, vos passions, votre expérience..."
                    className="min-h-[120px] w-full resize-none bg-white text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="my-12.5">
            <Separator />
          </div>

          <div className="sticky bottom-0 z-50 bg-white">
            <div className="-mx-4.5 mt-16.5">
              <div className="border-t border-black/10">
                <div className="flex items-center justify-end gap-4 px-6 pt-4">
                  <Link href="/profile/me">
                    <Button variant="secondary" disabled={isUpdating}>
                      Retour
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Enregistrement..." : "Confirmer"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
