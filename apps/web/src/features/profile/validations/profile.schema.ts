import { z } from "zod";

import { urlWithDomainCheck } from "@/shared/validations/url-with-domain-check.schema";

export const profileSchema = z.object({
  avatarUrl: z.string().optional(),
  username: z
    .string()
    .min(1, "Le nom d'utilisateur est requis")
    .max(50, "Le nom d'utilisateur ne peut pas dépasser 50 caractères"),
  jobTitle: z
    .string()
    .max(200, "Le titre ne peut pas dépasser 200 caractères")
    .optional(),
  bio: z
    .string()
    .max(500, "La bio ne peut pas dépasser 500 caractères")
    .optional(),
  techStacks: z
    .array(z.string())
    .max(10, "Maximum 10 technologies autorisées")
    .optional(),
  socialLinks: z
    .object({
      github: urlWithDomainCheck(
        ["github.com"],
        "URL GitHub invalide (doit contenir github.com)"
      ),
      discord: urlWithDomainCheck(
        ["discord.gg", "discord.com"],
        "URL Discord invalide (doit contenir discord.com ou discord.gg)"
      ),
      twitter: urlWithDomainCheck(
        ["twitter.com", "x.com"],
        "URL Twitter/X invalide (doit contenir twitter.com ou x.com)"
      ),
      linkedin: urlWithDomainCheck(
        ["linkedin.com"],
        "URL LinkedIn invalide (doit contenir linkedin.com)"
      ),
      website: urlWithDomainCheck([], "URL du site web invalide"),
    })
    .optional(),
});

export const CreateProfileSchema = profileSchema;

export const UpdateProfileSchema = profileSchema;

export type ProfileSchema = z.infer<typeof profileSchema>;
export type CreateProfileData = z.infer<typeof CreateProfileSchema>;
export type UpdateProfileData = z.infer<typeof UpdateProfileSchema>;
