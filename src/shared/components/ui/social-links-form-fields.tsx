"use client";

import { FieldValues, Path, UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";
import { InputWithIcon } from "@/shared/components/ui/input-with-icon";

export type SocialLinksValues = {
  githubUrl?: string;
  gitlabUrl?: string;
  discordUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
};

const socialLinksConfig = [
  {
    name: "githubUrl",
    icon: "github",
    placeholder: "https://github.com/...",
    label: "GitHub",
  },
  {
    name: "gitlabUrl",
    icon: "gitlab",
    placeholder: "https://gitlab.com/...",
    label: "GitLab",
  },
  {
    name: "discordUrl",
    icon: "discord",
    placeholder: "https://discord.gg/...",
    label: "Discord",
  },
  {
    name: "twitterUrl",
    icon: "twitter",
    placeholder: "https://x.com/...",
    label: "Twitter/X",
  },
  {
    name: "linkedinUrl",
    icon: "linkedin",
    placeholder: "https://linkedin.com/...",
    label: "LinkedIn",
  },
  {
    name: "websiteUrl",
    icon: "link",
    placeholder: "https://...",
    label: "Website",
  },
] as const;

interface SocialLinksFormFieldsProps<
  TFieldValues extends FieldValues = SocialLinksValues,
> {
  form: UseFormReturn<TFieldValues>;
  className?: string;
}

export function SocialLinksFormFields<
  TFieldValues extends FieldValues = SocialLinksValues,
>({ form, className = "" }: SocialLinksFormFieldsProps<TFieldValues>) {
  const { control } = form;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {socialLinksConfig.map(({ name, icon, placeholder }) => (
        <FormField<TFieldValues>
          key={name}
          control={control}
          name={name as Path<TFieldValues>}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithIcon
                  icon={icon}
                  placeholder={placeholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
