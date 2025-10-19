"use client";

import { useForm } from "react-hook-form";

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
import { useCategories } from "@/shared/hooks/use-category.hook";
import { useTechStack } from "@/shared/hooks/use-tech-stack.hook";

import useAuth from "@/features/auth/hooks/use-auth.hook";
import { useProfileUpdate } from "@/features/profile/hooks/use-profile.hook";

type OnboardingFormValues = {
  title: string;
  techStacks: string[];
  categories: string[];
};

export default function OnboardingForm() {
  const form = useForm<OnboardingFormValues>({
    defaultValues: {
      title: "",
      techStacks: [],
      categories: [],
    },
    mode: "onChange",
  });

  const { techStackOptions } = useTechStack();
  const { categoryOptions } = useCategories();
  const { currentUser } = useAuth();
  const { updateProfileAsync, isUpdating } = useProfileUpdate();

  const { control, handleSubmit } = form;

  const onSubmit = handleSubmit(async (values) => {
    const id = currentUser?.publicId || currentUser?.id || "";
    if (!id) return;

    await updateProfileAsync({
      id,
      updateData: {
        name: currentUser?.name || "",
        image: currentUser?.image || "",
        jobTitle: values.title || currentUser?.jobTitle || "",
        userTechStacks: values.techStacks,
        bio: currentUser?.bio || "",
        githubUrl: currentUser?.githubUrl || undefined,
        gitlabUrl: currentUser?.gitlabUrl || undefined,
        discordUrl: currentUser?.discordUrl || undefined,
        twitterUrl: currentUser?.twitterUrl || undefined,
        linkedinUrl: currentUser?.linkedinUrl || undefined,
        websiteUrl: currentUser?.websiteUrl || undefined,
      },
    });

    location.href = "/";
  });

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="p-4">
          <div className="mb-7 text-center">
            <h1 className="mb-2 text-2xl">Let’s get you started</h1>
            <p className="mt-0 text-sm text-black/70">
              Enter your information to get top project picks.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Title</FormLabel>
                    <FormControl>
                      <Input placeholder="eg; Fullstack Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="techStacks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technical Skills</FormLabel>
                    <FormControl>
                      <Combobox
                        options={techStackOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Technologies"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favorite Categories</FormLabel>
                    <FormControl>
                      <Combobox
                        options={categoryOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Categories"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isUpdating}
              >
                Continue
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
