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
  image: z.string().optional(),
  coverImages: z
    .array(z.string())
    .max(4, "Maximum 4 images de couverture autorisées")
    .optional(),
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
// API SCHEMAS (FOR BACKEND)
// ========================================

// API schema - what the backend expects
export const createProjectApiSchema = z.object({
  title: z.string().min(3, "Le titre du projet est requis"),
  description: z.string().min(10, "Une description est requise"),
  shortDescription: z.string().min(10, "Une description est requise"),
  image: z.string().optional(),
  coverImages: z.array(z.string()).max(4).optional(),
  readme: z.string().optional(),
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

// API schema for updates - what the backend expects
export const updateProjectApiSchema = z.object({
  title: z.string().min(3, "Le titre du projet est requis"),
  description: z.string().min(10, "Une description est requise"),
  shortDescription: z.string().min(10, "Une description est requise"),
  image: z.string().optional(),
  coverImages: z.array(z.string()).max(4).optional(),
  techStacks: z.array(z.string()),
  categories: z.array(z.string()),
  keyFeatures: z
    .array(z.string())
    .min(1, "Au moins une fonctionnalité clé est requise"),
  projectGoals: z.array(z.string()).min(1, "Au moins un objectif est requis"),
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

// API types
export type CreateProjectApiData = z.infer<typeof createProjectApiSchema>;
export type UpdateProjectApiData = z.infer<typeof updateProjectApiSchema>;

// Wrapper types
export type CreateProjectData = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectData = z.infer<typeof UpdateProjectSchema>;
