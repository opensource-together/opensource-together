import { mockProjects } from "../mocks/project.mock";
import { ProjectFormData } from "../stores/project-create.store";
import { CreateProjectApiResponse, Project } from "../types/project.type";
import { createProjectApiSchema } from "../validations/project-stepper.schema";
import {
  UpdateProjectData,
  UpdateProjectSchema,
} from "../validations/project.schema";

/**
 * Get the list of projects
 */
export const getProjects = async (): Promise<Project[]> => {
  try {
    return Promise.resolve(mockProjects);
  } catch (error) {
    console.error("Error while sending the request to the API:", error);
    throw error;
  }
};

/**
 * Get project details by project ID
 */
export const getProjectDetails = async (
  projectId: string
): Promise<Project> => {
  // In a real scenario, this would call the API
  // return get<Project>(`/projects/${projectId}`);
  // For now, return mock data
  return Promise.resolve(
    mockProjects.find((p) => p.id === projectId) || mockProjects[0]
  );
};

/**
 * Create a new project via API
 */
export const createProject = async (
  storeData: ProjectFormData
): Promise<Project> => {
  // Préparer et valider les données pour l'API
  const apiData = createProjectApiSchema.parse({
    title: storeData.projectName,
    description: storeData.shortDescription,
    shortDescription: storeData.shortDescription,
    techStacks: storeData.techStack?.map((tech) => tech.id) || [],
    projectRoles: storeData.roles.map((role) => ({
      title: role.title,
      description: role.description,
      techStacks: role.techStacks?.map((tech) => tech.id) || [],
    })),
  });

  console.log("Données préparées pour l'API:", apiData);

  // Appel API direct avec fetch natif
  const response = await fetch("http://localhost:4000/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Pour inclure les cookies d'authentification
    body: JSON.stringify(apiData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.message || response.statusText;
    throw new Error(`Erreur API: ${response.status} - ${message}`);
  }

  const apiResponse: CreateProjectApiResponse = await response.json();

  // Mapper la réponse vers le format Project
  return {
    id: apiResponse.id,
    title: apiResponse.title,
    shortDescription: apiResponse.shortDescription,
    longDescription: apiResponse.description,
    status: "DRAFT",
    techStacks: apiResponse.techStacks || [],
    roles: apiResponse.projectRoles || [],
    externalLinks: apiResponse.externalLinks || storeData.externalLinks || [],
    keyFeatures: storeData.keyFeatures || [],
    projectGoals: storeData.projectGoals || [],
    categories: storeData.categories || [],
    author: { id: "current-user", name: "Current User" },
    createdAt: apiResponse.createdAt
      ? new Date(apiResponse.createdAt)
      : new Date(),
    updatedAt: apiResponse.updatedAt
      ? new Date(apiResponse.updatedAt)
      : new Date(),
  };
};

/**
 * Update a project
 * @param params update project parameters containing data and projectId
 * @returns the updated project
 */
export const updateProject = async (
  params: UpdateProjectData
): Promise<Project> => {
  try {
    // Validate input parameters
    const validatedParams = UpdateProjectSchema.parse(params);
    const { data, projectId } = validatedParams;

    console.log(`Updating project ${projectId}:`, data);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Get existing project
    const existingProject = await getProjectDetails(projectId);

    // Merge existing data with new data
    const updatedProject: Project = {
      ...existingProject,
      title: data.title,
      shortDescription: data.description,
      longDescription: data.longDescription,
      status: data.status,
      techStacks: data.techStacks,
      roles:
        data.roles?.map((role) => ({
          id: crypto.randomUUID(),
          title: role.title,
          description: role.description,
          techStacks: role.techStacks || [],
        })) || existingProject.roles,
      externalLinks:
        data.socialLinks?.map((link) => ({
          type: link.type,
          url: link.url,
        })) || existingProject.externalLinks,
      updatedAt: new Date(),
    };

    console.log("Project updated successfully:", updatedProject);
    return updatedProject;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};
