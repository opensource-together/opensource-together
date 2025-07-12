import { API_BASE_URL } from "@/config/config";

import { mockProjects } from "../mocks/project.mock";
import { ProjectFormData } from "../stores/project-create.store";
import { Project } from "../types/project.type";
import { createProjectApiSchema } from "../validations/project-stepper.schema";
import {
  UpdateProjectData,
  UpdateProjectSchema,
} from "../validations/project.schema";
import { transformProjectForApi } from "./project-transform.service";

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
  try {
    // Transform store data to API format
    const apiData = transformProjectForApi(storeData);

    const validatedData = createProjectApiSchema.parse(apiData);

    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error creating project");
    }

    return response.json();
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
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

    // console.log(`Updating project ${projectId}:`, data);

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

    //console.log("Project updated successfully:", updatedProject);

    return updatedProject;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};
