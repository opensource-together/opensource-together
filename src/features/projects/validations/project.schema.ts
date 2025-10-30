import { z } from "zod";

import { urlWithDomainCheck } from "@/shared/validations/url-with-domain-check.schema";

// ========================================
// MAIN PROJECT SCHEMAS
// ========================================

// Full Project Schema (for editing existing projects)
export const projectSchema = z.object({
  title: z
    .string()
    .min(2, "The project name must contain at least 2 characters")
    .max(50, "The project name cannot exceed 50 characters"),
  description: z
    .string()
    .min(10, "The description must contain at least 10 characters"),
  provider: z.enum(["GITHUB", "GITLAB"]),
  projectTechStacks: z
    .array(z.string())
    .min(1, "At least one technology is required")
    .max(10, "Maximum 10 technologies allowed"),
  projectCategories: z
    .array(z.string())
    .min(1, "At least one category is required")
    .max(6, "Maximum 6 categories allowed"),
  logoUrl: z.string().optional(),
  imagesUrls: z
    .array(z.string())
    .max(4, "Maximum 4 images cover allowed")
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

// ========================================
// API SCHEMAS (FOR BACKEND)
// ========================================

// API schema - what the backend expects
export const createProjectApiSchema = z.object({
  title: z
    .string()
    .min(2, "Title is required")
    .max(50, "Title cannot exceed 50 characters"),
  description: z.string().min(10, "Description is required"),
  provider: z.enum(["GITHUB", "GITLAB"]),
  logoUrl: z.string().optional(),
  imagesUrls: z.array(z.string()).max(4).optional(),
  readme: z.string().optional(),
  projectTechStacks: z.array(z.string()),
  projectCategories: z.array(z.string()),
  repoUrl: urlWithDomainCheck([], "Invalid repository URL").optional(),
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
    "URL Linked In invalide (must contain linkedin.com)"
  ).optional(),
  websiteUrl: urlWithDomainCheck([], "Invalid website URL").optional(),
});

// API schema for updates - what the backend expects
export const updateProjectApiSchema = z.object({
  title: z
    .string()
    .min(2, "Title is required")
    .max(50, "Title cannot exceed 50 characters"),
  description: z.string().min(10, "Description is required"),
  logoUrl: z.string().optional(),
  imagesUrls: z.array(z.string()).max(4).optional(),
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

export const UpdateProjectSchema = projectSchema;

// ========================================
// BASE TYPE EXPORTS
// ========================================

// Main project types
export type ProjectSchema = z.infer<typeof createProjectApiSchema>;

// API types
export type CreateProjectApiData = z.infer<typeof createProjectApiSchema>;
export type UpdateProjectApiData = z.infer<typeof updateProjectApiSchema>;

// Wrapper types
export type CreateProjectData = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectData = z.infer<typeof UpdateProjectSchema>;
