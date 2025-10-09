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
  logo: z.instanceof(File).optional(),
  title: z
    .string()
    .min(2, "The project name must contain at least 2 characters"),
  description: z
    .string()
    .min(10, "The description must contain at least 10 characters")
    .max(100, "The description cannot exceed 100 characters"),
  coverImages: z.array(z.instanceof(File)).optional(),
});

export const stepTechCategoriesSchema = z.object({
  techStack: z
    .array(z.string())
    .min(1, "At least one technology is required")
    .max(10, "Maximum 10 technologies allowed"),
  categories: z
    .array(z.string())
    .min(1, "At least one category is required")
    .max(6, "Maximum 6 categories allowed"),
  externalLinks: z
    .object({
      github: urlWithDomainCheck(
        ["github.com"],
        "Invalid GitHub URL (must contain github.com)"
      ),
      gitlab: urlWithDomainCheck(
        ["gitlab.com"],
        "Invalid GitLab URL (must contain gitlab.com)"
      ),
      discord: urlWithDomainCheck(
        ["discord.gg", "discord.com"],
        "Invalid Discord URL (must contain discord.com or discord.gg)"
      ),
      twitter: urlWithDomainCheck(
        ["twitter.com", "x.com"],
        "Invalid Twitter/X URL (must contain twitter.com or x.com)"
      ),
      linkedin: urlWithDomainCheck(
        ["linkedin.com"],
        "Invalid LinkedIn URL (must contain linkedin.com)"
      ),
      website: urlWithDomainCheck([], "Invalid website URL"),
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
