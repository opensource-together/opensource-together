import { ProjectFormData } from "../stores/project-create.store";
import { TechStack } from "../types/project.type";
import {
  CreateProjectApiData,
  ProjectSchema,
  UpdateProjectApiData,
} from "../validations/project.schema";

/**
 * Transforms store data to API format.
 *
 * @param storeData - The data from the store.
 * @param imageFile - The image file for the new project.
 * @returns The transformed data for the API.
 */
export const transformProjectForApi = (
  storeData: ProjectFormData
): CreateProjectApiData => {
  return {
    title: storeData.title,
    description: storeData.shortDescription,
    shortDescription: storeData.shortDescription,
    image: storeData.image || undefined,
    externalLinks: storeData.externalLinks || [],
    techStacks: storeData.techStack.map((tech) => tech.id),
    categories: storeData.categories.map((cat) => cat.id),
    keyFeatures: storeData.keyFeatures.map((feature) => feature.feature),
    projectGoals: storeData.projectGoals.map((goal) => goal.goal),
    projectRoles: storeData.roles.map((role) => ({
      title: role.title,
      description: role.description,
      techStacks: role.techStacks?.map((tech: TechStack) => tech.id),
    })),
  };
};

/**
 * Transforms project edit form data to API format for updates.
 *
 * @param formData - The validated form data from project schema.
 * @returns The transformed data for the API.
 */
export const transformProjectForApiUpdate = (
  formData: ProjectSchema
): UpdateProjectApiData => {
  return {
    title: formData.title,
    description: formData.shortDescription,
    shortDescription: formData.shortDescription,
    image: formData.image || undefined,
    externalLinks: formData.externalLinks
      ? Object.entries(formData.externalLinks)
          .filter(([_, url]) => typeof url === "string" && url.trim())
          .map(([type, url]) => ({
            type: type === "website" ? "other" : type,
            url: url as string,
          }))
      : [],
    techStacks: formData.techStack || [],
    categories: formData.categories || [],
    keyFeatures: formData.keyFeatures?.map((feature) => feature.feature) || [],
    projectGoals: formData.projectGoals?.map((goal) => goal.goal) || [],
  };
};
