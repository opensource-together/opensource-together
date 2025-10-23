import { z } from "zod";

import { urlWithDomainCheck } from "@/shared/validations/url-with-domain-check.schema";

export const profileSchema = z.object({
  image: z.string().optional(),
  name: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username cannot exceed 50 characters"),
  jobTitle: z
    .string()
    // .min(1, "Job title is required")
    .max(200, "Le titre ne peut pas dépasser 200 caractères")
    .optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  userTechStacks: z
    .array(z.string())
    // .min(1, "At least one technology is required")
    .max(10, "Maximum 10 technologies allowed")
    .optional(),
  githubUrl: urlWithDomainCheck(
    ["github.com"],
    "Invalid GitHub URL (must contain github.com)"
  ).optional(),
  gitlabUrl: urlWithDomainCheck(
    ["gitlab.com"],
    "Invalid GitLab URL (must contain gitlab.com)"
  ).optional(),
  discordUrl: urlWithDomainCheck(
    ["discord.gg", "discord.com"],
    "Invalid Discord URL (must contain discord.com or discord.gg)"
  ).optional(),
  twitterUrl: urlWithDomainCheck(
    ["twitter.com", "x.com"],
    "Invalid Twitter/X URL (must contain twitter.com or x.com)"
  ).optional(),
  linkedinUrl: urlWithDomainCheck(
    ["linkedin.com"],
    "Invalid LinkedIn URL (must contain linkedin.com)"
  ).optional(),
  websiteUrl: urlWithDomainCheck([], "Invalid website URL").optional(),
});

export const CreateProfileSchema = profileSchema;

export const UpdateProfileSchema = profileSchema;

export type ProfileSchema = z.infer<typeof profileSchema>;
export type CreateProfileData = z.infer<typeof CreateProfileSchema>;
export type UpdateProfileData = z.infer<typeof UpdateProfileSchema>;
