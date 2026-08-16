import { z } from "zod";

import { urlWithDomainCheck } from "@/shared/validations/url-with-domain-check.schema";

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
  provider: z.enum(["GITHUB", "GITLAB"]),
  logoUrl: z.string().optional(),
  imagesUrls: z.array(z.string()).max(4).optional(),
  published: z.boolean(),
  projectTechStacks: z.array(z.string()),
  projectCategories: z.array(z.string()),
  repoUrl: urlWithDomainCheck([], "Invalid repository URL"),
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

export type CreateProjectInput = z.infer<typeof createProjectApiSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectApiSchema>;
