import { z } from "zod";

import { urlWithDomainCheck } from "@/shared/validations/url-with-domain-check.schema";

// ========================================
// MAIN PROJECT SCHEMAS
// ========================================

// Full Project Schema (for editing existing projects)
export const projectSchema = z.object({
  title: z
    .string()
    .min(3, "Le nom du projet doit contenir au moins 3 caractères"),
  shortDescription: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  keyFeatures: z
    .array(
      z.object({
        feature: z.string(),
      })
    )
    .min(1, "Au moins une fonctionnalité clé est requise"),
  projectGoals: z
    .array(
      z.object({
        goal: z.string(),
      })
    )
    .min(1, "Au moins un objectif est requis"),
  techStack: z
    .array(z.string())
    .min(1, "Au moins une technologie est requise")
    .max(10, "Maximum 10 technologies autorisées"),
  categories: z
    .array(z.string())
    .min(1, "Au moins une catégorie est requise")
    .max(6, "Maximum 6 catégories autorisées"),
  projectRoles: z.array(
    z.object({
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
    })
  ),
  image: z.string().optional(),
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
// WRAPPER SCHEMAS
// ========================================

export const CreateProjectSchema = z.object({
  projectId: z.string().min(1),
  data: projectSchema,
});

export const UpdateProjectSchema = z.object({
  projectId: z.string().min(1),
  data: projectSchema,
});

// ========================================
// BASE TYPE EXPORTS
// ========================================

// Main project types
export type ProjectSchema = z.infer<typeof projectSchema>;

// Wrapper types
export type CreateProjectData = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectData = z.infer<typeof UpdateProjectSchema>;
