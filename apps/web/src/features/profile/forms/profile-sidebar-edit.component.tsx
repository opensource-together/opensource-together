"use client";

import { UseFormReturn } from "react-hook-form";

import BreadcrumbComponent from "@/shared/components/shared/Breadcrumb";
import { Combobox } from "@/shared/components/ui/combobox";
import {
  FormControl,
  FormField,
  FormItem,
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

export default function ProfileSidebarEdit({
  profile,
  form,
}: ProfileSidebarEditProps) {
  const { techStackOptions, isLoading: techStacksLoading } = useTechStack();

  const breadcrumbItems = [
    {
      label: "Discover",
      href: "/",
      isActive: false,
    },
    {
      label: profile.name || "Profile",
      isActive: true,
    },
  ];

  const { control } = form;

  return (
    <div className="w-[252px]">
      {/* Breadcrumb */}
      <BreadcrumbComponent
        items={breadcrumbItems}
        className="mt-[-16px] mb-3 mb-8 ml-[2px]"
      />

      <div className="space-y-6">
        {/* Technologies Section */}
        <div className="space-y-3">
          <h3 className="text-md font-medium text-black">Technologies</h3>
          <FormField
            control={control}
            name="techStacks"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Combobox
                    options={techStackOptions}
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder={
                      techStacksLoading
                        ? "Chargement..."
                        : "Choisir Technologies"
                    }
                    searchPlaceholder="Rechercher..."
                    emptyText="Aucune technologie trouvée."
                    disabled={techStacksLoading}
                    maxSelections={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Liens externes Section */}
        <div className="space-y-3">
          <h3 className="text-md font-medium text-black">Liens externes</h3>

          <FormField
            control={control}
            name="externalLinks.linkedin"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputWithIcon icon="linkedin" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="externalLinks.twitter"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputWithIcon icon="twitter" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="externalLinks.website"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputWithIcon icon="link" placeholder="https:/" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
