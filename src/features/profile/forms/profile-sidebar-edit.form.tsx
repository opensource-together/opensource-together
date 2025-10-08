"use client";

import { UseFormReturn } from "react-hook-form";

import { Combobox } from "@/shared/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { InputWithIcon } from "@/shared/components/ui/input-with-icon";
import { useTechStack } from "@/shared/hooks/use-tech-stack.hook";

import { Profile } from "../types/profile.type";
import { ProfileSchema } from "../validations/profile.schema";

interface ProfileSidebarEditProps {
  profile: Profile;
  form: UseFormReturn<ProfileSchema>;
}

export default function ProfileSidebarEditForm({
  form,
}: ProfileSidebarEditProps) {
  const { techStackOptions, isLoading: techStacksLoading } = useTechStack();
  const { control } = form;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="flex flex-col space-y-10 md:max-w-[260px]">
        <Form {...form}>
          <FormField
            control={control}
            name="userTechStacks"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Technologies (max 10)</FormLabel>
                <FormControl>
                  <Combobox
                    options={techStackOptions}
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder={
                      techStacksLoading
                        ? "Loading technologies..."
                        : "Add technologies..."
                    }
                    searchPlaceholder="Search for a technology..."
                    emptyText="No technology found."
                    disabled={techStacksLoading}
                    maxSelections={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2.5">
            <FormLabel>Social Links</FormLabel>

            <FormField
              control={control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithIcon
                      icon="github"
                      placeholder="https://github.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="gitlabUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithIcon
                      icon="gitlab"
                      placeholder="https://gitlab.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="discordUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithIcon
                      icon="discord"
                      placeholder="https://discord.gg/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="twitterUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithIcon
                      icon="twitter"
                      placeholder="https://x.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithIcon
                      icon="linkedin"
                      placeholder="https://linkedin.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithIcon
                      icon="link"
                      placeholder="https://..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </div>
    </div>
  );
}
