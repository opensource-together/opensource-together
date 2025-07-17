import { z } from "zod";

export const profileEditSchema = z.object({
  avatarUrl: z.string().optional(),
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  company: z.string().optional(),
  bio: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length <= 500,
      "La description ne peut pas dépasser 500 caractères"
    ),
  techStacks: z.array(z.string()),
  externalLinks: z.object({
    linkedin: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.includes("linkedin.com"),
        "L'URL LinkedIn doit contenir 'linkedin.com'"
      ),
    twitter: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.includes("twitter.com") || val.includes("x.com"),
        "L'URL Twitter doit contenir 'twitter.com' ou 'x.com'"
      ),
    website: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.startsWith("http"),
        "L'URL du site web doit commencer par 'http'"
      ),
  }),
});

export type ProfileEditSchema = z.infer<typeof profileEditSchema>;
