import { z } from "zod";

import { urlWithDomainCheck } from "@/shared/validations/url-with-domain-check.schema";

const dateStringSchema = z
  .string()
  .refine(
    (val) =>
      /^\d{4}-\d{2}-\d{2}$/.test(val) && !Number.isNaN(new Date(val).getTime()),
    { message: "Invalid date format (YYYY-MM-DD)" }
  );

export const experienceSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(50, "Title cannot exceed 50 characters"),
    startAt: dateStringSchema,
    endAt: z
      .union([dateStringSchema, z.null()])
      .optional()
      .refine(
        (val) => val === undefined || val === null || typeof val === "string",
        { message: "Invalid end date" }
      ),
    url: urlWithDomainCheck([], "Invalid URL").nullable().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.endAt && val.startAt) {
      const start = new Date(val.startAt + "T00:00:00");
      const end = new Date(val.endAt + "T00:00:00");
      if (end < start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date cannot be earlier than start date",
          path: ["endAt"],
        });
      }
    }
  });

export const profileSchema = z.object({
  image: z.string().optional(),
  name: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username cannot exceed 50 characters"),
  jobTitle: z
    .string()
    .min(1, "Job title is required")
    .max(50, "Job title cannot exceed 50 characters"),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  userTechStacks: z
    .array(z.string())
    .min(1, "At least one technology is required")
    .max(10, "Maximum 10 technologies allowed"),
  userCategories: z
    .array(z.string())
    .min(1, "At least one category is required")
    .max(6, "Maximum 6 categories allowed"),
  experiences: z
    .array(experienceSchema)
    .max(10, "Maximum 10 experiences allowed")
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

export const CreateProfileSchema = profileSchema;

export const UpdateProfileSchema = profileSchema;

export type ProfileSchema = z.infer<typeof profileSchema>;
export type CreateProfileData = z.infer<typeof CreateProfileSchema>;
export type UpdateProfileData = z.infer<typeof UpdateProfileSchema>;
