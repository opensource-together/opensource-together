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
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  readme: z.string().optional(),
  provider: z.enum(["GITHUB", "GITLAB", "SCRATCH"]),
  projectTechStacks: z
    .array(z.string())
    .min(1, "Au moins une technologie est requise")
    .max(10, "Maximum 10 technologies autorisées"),
  projectCategories: z
    .array(z.string())
    .min(1, "Au moins une catégorie est requise")
    .max(6, "Maximum 6 catégories autorisées"),
  logoUrl: z.string().optional(),
  imagesUrls: z
    .array(z.string())
    .max(4, "Maximum 4 images de couverture autorisées")
    .optional(),
  githubUrl: urlWithDomainCheck(
    ["github.com"],
    "URL GitHub invalide (doit contenir github.com)"
  ).optional(),
  gitlabUrl: urlWithDomainCheck(
    ["gitlab.com"],
    "URL GitLab invalide (doit contenir gitlab.com)"
  ).optional(),
  discordUrl: urlWithDomainCheck(
    ["discord.gg", "discord.com"],
    "URL Discord invalide (doit contenir discord.com ou discord.gg)"
  ).optional(),
  twitterUrl: urlWithDomainCheck(
    ["twitter.com", "x.com"],
    "URL Twitter/X invalide (doit contenir twitter.com ou x.com)"
  ).optional(),
  linkedinUrl: urlWithDomainCheck(
    ["linkedin.com"],
    "URL LinkedIn invalide (doit contenir linkedin.com)"
  ).optional(),
  websiteUrl: urlWithDomainCheck([], "URL du site web invalide").optional(),
});

// ========================================
// API SCHEMAS (FOR BACKEND)
// ========================================

// API schema - what the backend expects
export const createProjectApiSchema = z.object({
  title: z.string().min(3, "Le titre du projet est requis"),
  description: z.string().min(10, "Une description est requise"),
  image: z.string().optional(),
  coverImages: z.array(z.string()).max(4).optional(),
  readme: z.string().optional(),
  projectTechStacks: z.array(z.string()),
  projectCategories: z.array(z.string()),
  githubUrl: urlWithDomainCheck(
    ["github.com"],
    "URL GitHub invalide (doit contenir github.com)"
  ).optional(),
  gitlabUrl: urlWithDomainCheck(
    ["gitlab.com"],
    "URL GitLab invalide (doit contenir gitlab.com)"
  ).optional(),
  discordUrl: urlWithDomainCheck(
    ["discord.gg", "discord.com"],
    "URL Discord invalide (doit contenir discord.com ou discord.gg)"
  ).optional(),
  twitterUrl: urlWithDomainCheck(
    ["twitter.com", "x.com"],
    "URL Twitter/X invalide (doit contenir twitter.com ou x.com)"
  ).optional(),
  linkedinUrl: urlWithDomainCheck(
    ["linkedin.com"],
    "URL LinkedIn invalide (doit contenir linkedin.com)"
  ).optional(),
  websiteUrl: urlWithDomainCheck([], "URL du site web invalide").optional(),
});

// API schema for updates - what the backend expects
export const updateProjectApiSchema = z.object({
  title: z.string().min(3, "Le titre du projet est requis"),
  description: z.string().min(10, "Une description est requise"),
  logoUrl: z.string().optional(),
  imagesUrls: z.array(z.string()).max(4).optional(),
  readme: z.string().max(10000).optional(),
  projectTechStacks: z.array(z.string()),
  projectCategories: z.array(z.string()),
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
