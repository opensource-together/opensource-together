import { z } from "zod";

import { urlWithDomainCheck } from "@/shared/validations/url-with-domain-check.schema";

// ========================================
// STEPPER FORM SCHEMAS
// ========================================

// Step 1: Basic Project Information
export const stepOneSchema = z.object({
  title: z
    .string()
    .min(3, "Le nom du projet doit contenir au moins 3 caractères"),
  shortDescription: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  keyFeatures: z
    .array(
      z.object({
        title: z.string(),
      })
    )
    .min(1, "Au moins une fonctionnalité clé est requise"),
  projectGoals: z
    .array(
      z.object({
        goal: z.string(),
      })
    )
    .min(1, "Au moins un objectif de projet est requis"),
});

// Step 2: Tech Stack and Categories
export const stepTwoSchema = z.object({
  techStack: z
    .array(z.string())
    .min(1, "Au moins une technologie est requise")
    .max(10, "Maximum 10 technologies autorisées"),
  categories: z
    .array(z.string())
    .min(1, "Au moins une catégorie est requise")
    .max(6, "Maximum 6 catégories autorisées"),
});

// Step 3: Project Roles (reuse base role validation logic)
export const roleSchema = z.object({
  title: z
    .string()
    .min(3, "Le titre du rôle doit contenir au moins 3 caractères"),
  techStack: z
    .array(z.string())
    .min(1, "Au moins une technologie est requise")
    .max(6, "Maximum 6 technologies autorisées"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(250, "La description ne peut pas dépasser 250 caractères"),
});

export const stepThreeSchema = z.object({
  roles: z.array(roleSchema).min(1, "Au moins un rôle est requis"),
});

// Step 4: External Links and Logo (with domain validation)
export const stepFourSchema = z.object({
  logo: z.instanceof(File).optional(),
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
  ...stepOneSchema.shape,
  ...stepTwoSchema.shape,
  ...stepThreeSchema.shape,
  selectedRepository: z
    .object({
      name: z.string(),
      date: z.string(),
    })
    .nullable(),
});

// ========================================
// API SCHEMAS (FOR BACKEND)
// ========================================

// API schema - what the backend expects
export const createProjectApiSchema = z.object({
  title: z.string().min(3, "Le titre du projet est requis"),
  shortDescription: z.string().min(10, "Une description est requise"),
  techStacks: z.array(z.string()),
  categories: z.array(z.string()),
  keyFeatures: z
    .array(z.string())
    .min(1, "Au moins une fonctionnalité clé est requise"),
  projectGoals: z.array(z.string()).min(1, "Au moins un objectif est requis"),
  projectRoles: z.array(
    z.object({
      title: z.string().min(1, "Le titre du rôle est requis"),
      description: z.string().min(1, "La description du rôle est requise"),
      techStacks: z.array(z.string()),
    })
  ),
  externalLinks: z
    .array(
      z.object({
        type: z.string(),
        url: z.string(),
      })
    )
    .optional(),
});

// ========================================
// TYPE EXPORTS
// ========================================

export type StepOneFormData = z.infer<typeof stepOneSchema>;
export type StepTwoFormData = z.infer<typeof stepTwoSchema>;
export type RoleFormData = z.infer<typeof roleSchema>;
export type StepThreeFormData = z.infer<typeof stepThreeSchema>;
export type StepFourFormData = z.infer<typeof stepFourSchema>;
export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
export type CreateProjectApiData = z.infer<typeof createProjectApiSchema>;
