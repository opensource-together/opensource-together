import { ProjectFormData } from "../stores/project-create.store";
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
    description: storeData.description,
    image: storeData.image || undefined,
    readme: storeData.readme || undefined,
    externalLinks:
      storeData.externalLinks?.map((link) => ({
        ...link,
        type: link.type.toUpperCase(),
      })) || [],
    techStacks: storeData.techStack.map((tech) => tech.id),
    categories: storeData.categories.map((cat) => cat.id),
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
    description: formData.description,
    image: formData.image || undefined,
    coverImages: formData.coverImages || [],
    externalLinks: formData.externalLinks
      ? Object.entries(formData.externalLinks)
          .filter(([_, url]) => typeof url === "string" && url.trim())
          .map(([type, url]) => ({
            type: (type === "website" ? "other" : type).toUpperCase(),
            url: url as string,
          }))
      : [],
    techStacks: formData.techStack || [],
    categories: formData.categories || [],
  };
};
