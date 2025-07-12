import { z } from "zod";

const techStackSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nom de technologie requis"),
  iconUrl: z.string().optional(),
});

const badgeSchema = z.object({
  label: z.string(),
  color: z.string(),
  bgColor: z.string(),
});

const roleSchema = z.object({
  title: z.string().min(1, "Titre du rôle requis"),
  description: z.string().min(1, "Description du rôle requise"),
  badges: z.array(badgeSchema),
  experienceBadge: z.string().optional(),
  techStacks: z.array(techStackSchema).optional(),
});

const socialLinkSchema = z.object({
  type: z.enum(
    ["github", "website", "discord", "twitter", "linkedin", "other"],
    {
      errorMap: () => ({ message: "Type de lien social invalide" }),
    }
  ),
  url: z.string().url("URL invalide"),
});

const keyFeatureSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Le titre de la fonctionnalité est requis"),
});

const projectGoalSchema = z.object({
  id: z.string().optional(),
  goal: z.string().min(1, "L'objectif est requis"),
});

const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Le nom de la catégorie est requis"),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Le titre du projet est requis"),
  description: z.string().min(1, "Une courte description est requise"),
  longDescription: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], {
    errorMap: () => ({ message: "Statut invalide" }),
  }),
  techStacks: z.array(techStackSchema),
  roles: z.array(roleSchema).optional(),
  keyBenefits: z.array(z.string()).optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
  keyFeatures: z.string().optional(),
  projectGoals: z.string().optional(),
  categories: z.array(categorySchema).optional(),
});

// Schema for the unified edit form
export const projectEditSchema = z.object({
  title: z.string().min(1, "Le titre du projet est requis"),
  description: z.string().min(1, "Une courte description est requise"),
  longDescription: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], {
    errorMap: () => ({ message: "Statut invalide" }),
  }),
  techStacks: z.array(techStackSchema),
  categories: z.array(categorySchema).optional(),
  keyFeatures: z.string().optional(),
  projectGoals: z.string().optional(),
  externalLinks: z
    .object({
      github: z.string().optional(),
      discord: z.string().optional(),
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      website: z.string().optional(),
    })
    .optional(),
});

export const CreateProjectSchema = z.object({
  projectId: z.string().min(1),
  data: projectSchema,
});

export const UpdateProjectSchema = z.object({
  projectId: z.string().min(1),
  data: projectSchema,
});

export type ProjectSchema = z.infer<typeof projectSchema>;
export type ProjectEditSchema = z.infer<typeof projectEditSchema>;
export type CreateProjectData = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectData = z.infer<typeof UpdateProjectSchema>;
