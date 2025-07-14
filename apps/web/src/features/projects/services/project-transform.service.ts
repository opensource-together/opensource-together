import { ProjectFormData } from "../stores/project-create.store";
import { TechStack } from "../types/project.type";
import { CreateProjectApiData } from "../validations/project-stepper.schema";

/**
 * Transforms store data to API format.
 *
 * @param storeData - The data from the store.
 * @returns The transformed data for the API.
 */
export const transformProjectForApi = (
  storeData: ProjectFormData
): CreateProjectApiData => {
  return {
    title: storeData.title,
    description: storeData.shortDescription,
    shortDescription: storeData.shortDescription,
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
