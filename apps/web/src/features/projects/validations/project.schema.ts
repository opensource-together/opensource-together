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
});

const socialLinkSchema = z.object({
  type: z.enum(["github", "website", "discord", "twitter", "other"], {
    errorMap: () => ({ message: "Type de lien social invalide" }),
  }),
  url: z.string().url("URL invalide"),
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
export type CreateProjectData = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectData = z.infer<typeof UpdateProjectSchema>;
