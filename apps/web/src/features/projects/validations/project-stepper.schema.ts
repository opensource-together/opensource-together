import { z } from "zod";

const keyFeatureSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
});

const projectGoalSchema = z.object({
  id: z.string().optional(),
  goal: z.string(),
});

const urlWithDomainCheck = (allowedDomains: string[], errorMsg: string) =>
  z
    .string()
    .trim()
    .transform((val) => {
      if (!val) return ""; // accept empty fields
      return val.startsWith("http://") || val.startsWith("https://")
        ? val
        : `https://${val}`;
    })
    .refine(
      (val) => {
        if (val === "") return true;

        try {
          const parsed = new URL(val);

          // The hostname must contain a dot (.)
          if (!parsed.hostname.includes(".")) return false;

          // If no specific domains, a valid URL is enough
          if (allowedDomains.length === 0) return true;

          return allowedDomains.some(
            (domain) =>
              parsed.hostname === domain ||
              parsed.hostname.endsWith(`.${domain}`)
          );
        } catch {
          return false;
        }
      },
      { message: errorMsg }
    )
    .optional()
    .or(z.literal(""));

// Step 1: Basic Project Information
export const stepOneSchema = z.object({
  projectName: z
    .string()
    .min(3, "Le nom du projet doit contenir au moins 3 caractères"),
  shortDescription: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  keyFeatures: z
    .array(keyFeatureSchema)
    .min(1, "Au moins une fonctionnalité clé est requise"),
  projectGoals: z
    .array(projectGoalSchema)
    .min(1, "Au moins un objectif de projet est requis"),
});

// Step 2: Tech Stack and Categories
export const stepTwoSchema = z.object({
  techStack: z.array(z.string()).min(1, "Au moins une technologie est requise"),
  categories: z.array(z.string()).min(1, "Au moins une catégorie est requise"),
});

// Step 3: Project Roles
export const roleSchema = z.object({
  title: z.string().min(1, "Le titre du rôle est requis"),
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

// Combined schema for the entire project creation form
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

// Step 4: Logo and External Links - using object input with conversion to ExternalLink array
export const stepFourSchema = z.object({
  logo: z.instanceof(File).optional(),
  externalLinks: z.object({
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
    website: urlWithDomainCheck([], "URL du site web invalide"),
  }),
});

// Schema pour l'API backend
export const createProjectApiSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  shortDescription: z.string().min(1, "La description courte est requise"),
  techStacks: z.array(z.string()),
  projectRoles: z.array(
    z.object({
      title: z.string().min(1, "Le titre du rôle est requis"),
      description: z.string().min(1, "La description du rôle est requise"),
      techStacks: z.array(z.string()),
    })
  ),
  externalLinks: z.array(
    z.object({
      type: z.string(),
      url: z.string(),
    })
  ).optional(),
});

/**
 * Mapping between frontend tech stack names and backend IDs
 * Based on the actual database values
 */
const TECH_STACK_NAME_TO_ID_MAPPING: Record<string, string> = {
  React: "1",
  "Next.js": "2",
  TypeScript: "3",
  "Tailwind CSS": "4",
  Prisma: "5",
  PostgreSQL: "6",
  Docker: "7",
  // Add other mappings as needed when more tech stacks are added to the database
};

/**
 * Helper function to extract tech stack IDs from TechStack objects or strings
 * Maps frontend tech stack names to backend IDs
 */
const extractTechStackIds = (techStacks: unknown[]): string[] => {
  return techStacks
    .map((tech) => {
      const techName =
        typeof tech === "string"
          ? tech
          : typeof tech === "object" && tech !== null && "name" in tech
            ? (tech as { name?: string; id?: string }).name ||
              (tech as { name?: string; id?: string }).id ||
              ""
            : "";

      // Try to get the backend ID from the mapping
      const backendId = TECH_STACK_NAME_TO_ID_MAPPING[techName];
      if (backendId) {
        return backendId;
      }

      // Fallback: if it's already a numeric string, use it as is
      if (typeof techName === "string" && /^\d+$/.test(techName)) {
        return techName;
      }

      // If no mapping found, log warning and return the original name/id
      console.warn(
        `⚠️ No backend ID mapping found for tech stack: "${techName}"`
      );
      return techName;
    })
    .filter(Boolean);
};

/**
 * Transform the store data to the API format
 * Handles automatically the conversion of tech stacks and the data structure
 */
export const projectStoreToApiSchema = z
  .object({
    projectName: z.string().min(1, "Le nom du projet est requis"),
    shortDescription: z.string().min(1, "La description courte est requise"),
    techStack: z.array(z.unknown()),
    roles: z.array(
      z.object({
        title: z.string().min(1, "Le titre du rôle est requis"),
        description: z.string().min(1, "La description du rôle est requise"),
        techStacks: z.array(z.unknown()).optional().default([]),
      })
    ),
    externalLinks: z.array(
      z.object({
        type: z.string(),
        url: z.string(),
      })
    ).optional(),
  })
  .transform((storeData) => ({
    title: storeData.projectName,
    description: storeData.shortDescription,
    shortDescription: storeData.shortDescription,
    externalLinks: storeData.externalLinks || [],
    techStacks: extractTechStackIds(storeData.techStack),
    projectRoles: storeData.roles.map((role) => ({
      title: role.title,
      description: role.description,
      techStacks: extractTechStackIds(role.techStacks || []),
    })),
  }));

// Type exports
export type StepOneFormData = z.infer<typeof stepOneSchema>;
export type StepTwoFormData = z.infer<typeof stepTwoSchema>;
export type RoleFormData = z.infer<typeof roleSchema>;
export type StepThreeFormData = z.infer<typeof stepThreeSchema>;
export type StepFourFormData = z.infer<typeof stepFourSchema>;
export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
export type CreateProjectApiData = z.infer<typeof createProjectApiSchema>;
export type ProjectStoreToApiData = z.input<typeof projectStoreToApiSchema>;
export type ProjectApiTransformed = z.output<typeof projectStoreToApiSchema>;
