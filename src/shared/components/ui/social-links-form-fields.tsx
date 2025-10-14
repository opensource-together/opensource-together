"use client";

import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { HiMiniLink } from "react-icons/hi2";
import {
  RiGithubFill,
  RiGitlabFill,
  RiLinkedinFill,
  RiTwitterXFill,
} from "react-icons/ri";
import { RxDiscordLogo } from "react-icons/rx";

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
    iconNode: <RiGithubFill size={18} />,
    placeholder: "https://github.com/...",
    label: "GitHub",
  },
  {
    name: "gitlabUrl",
    iconNode: <RiGitlabFill size={18} />,
    placeholder: "https://gitlab.com/...",
    label: "GitLab",
  },
  {
    name: "discordUrl",
    iconNode: <RxDiscordLogo size={18} />,
    placeholder: "https://discord.gg/...",
    label: "Discord",
  },
  {
    name: "twitterUrl",
    iconNode: <RiTwitterXFill size={18} />,
    placeholder: "https://x.com/...",
    label: "Twitter/X",
  },
  {
    name: "linkedinUrl",
    iconNode: <RiLinkedinFill size={18} />,
    placeholder: "https://linkedin.com/...",
    label: "LinkedIn",
  },
  {
    name: "websiteUrl",
    iconNode: <HiMiniLink size={18} />,
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
      {socialLinksConfig.map(({ name, iconNode, placeholder }) => (
        <FormField<TFieldValues>
          key={name}
          control={control}
          name={name as Path<TFieldValues>}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithIcon
                  iconNode={iconNode}
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
