import { Project } from "../types/project.type";

export const validateProjectForPublishing = (project: Project) => {
  const required = {
    title: project.title,
    description: project.description,
    repoUrl: project.repoUrl,
    provider: project.provider,
  };
  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  return {
    isValid: missing.length === 0,
    missingFields: missing.map((field) =>
      field === "repoUrl" ? "repository URL" : field
    ),
  };
};

// Transformation for API
export const transformProjectForPublishedToggle = (
  project: Project,
  published: boolean
) => ({
  title: project.title,
  description: project.description,
  repoUrl: project.repoUrl || "",
  provider: project.provider,
  published,
  projectTechStacks: project.projectTechStacks.map((tech) => tech.id),
  projectCategories: project.projectCategories.map((cat) => cat.id),
  logoUrl: project.logoUrl || undefined,
  imagesUrls: project.imagesUrls,
  githubUrl: project.githubUrl || "",
  gitlabUrl: project.gitlabUrl || "",
  discordUrl: project.discordUrl || "",
  twitterUrl: project.twitterUrl || "",
  linkedinUrl: project.linkedinUrl || "",
  websiteUrl: project.websiteUrl || "",
});

// Concise error message
export const formatMissingFieldsMessage = (missingFields: string[]): string => {
  if (missingFields.length === 0) return "";
  const fields =
    missingFields.length === 1
      ? missingFields[0]
      : `${missingFields.slice(0, -1).join(", ")} and ${missingFields[missingFields.length - 1]}`;
  return `Error: Missing ${fields}`;
};
