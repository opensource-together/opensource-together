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
import { SocialLinksFormFields } from "@/shared/components/ui/social-links-form-fields";
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
            <SocialLinksFormFields form={form} />
          </div>
        </Form>
      </div>
    </div>
  );
}
