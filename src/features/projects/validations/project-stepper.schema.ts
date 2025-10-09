import { z } from "zod";

import { urlWithDomainCheck } from "@/shared/validations/url-with-domain-check.schema";

// ========================================
// STEPPER FORM SCHEMAS
// ========================================

export const selectedRepoSchema = z.object({
  selectedRepository: z
    .object({
      owner: z.string().optional(),
      readme: z.string().optional(),
      title: z.string(),
      url: z.string(),
    })
    .nullable(),
});

export const stepDescribeProjectSchema = z.object({
  title: z
    .string()
    .min(3, "Le nom du projet doit contenir au moins 3 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(100, "La description ne peut pas dépasser 100 caractères"),
  coverImages: z.array(z.instanceof(File)).optional(),
});

export const stepTechCategoriesSchema = z.object({
  logo: z.instanceof(File).optional(),
  techStack: z
    .array(z.string())
    .min(1, "Au moins une technologie est requise")
    .max(10, "Maximum 10 technologies autorisées"),
  categories: z
    .array(z.string())
    .min(1, "Au moins une catégorie est requise")
    .max(6, "Maximum 6 catégories autorisées"),
  externalLinks: z
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

// ========================================
// COMBINED SCHEMAS
// ========================================

// Create Project Schema (for stepper form)
export const createProjectSchema = z.object({
  method: z.enum(["github", "scratch"]).nullable(),
  ...stepDescribeProjectSchema.shape,
  ...stepTechCategoriesSchema.shape,
  selectedRepository: selectedRepoSchema,
});

// ========================================
// TYPE EXPORTS
// ========================================
export type SelectedRepoFormData = z.infer<typeof selectedRepoSchema>;
export type StepDescribeProjectFormData = z.infer<
  typeof stepDescribeProjectSchema
>;
export type StepTechCategoriesFormData = z.infer<
  typeof stepTechCategoriesSchema
>;
export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
