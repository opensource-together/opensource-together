import { mockProjects } from "../mocks/project-mock";
import { Project } from "../types/project.type";
import {
  CreateProjectData,
  CreateProjectSchema,
  UpdateProjectData,
  UpdateProjectSchema,
} from "../validations/project.api.schema";

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
 * Create a new project
 */
export const createProject = async (
  data: CreateProjectData
): Promise<Project> => {
  try {
    // Validate input data
    const validatedData = CreateProjectSchema.parse(data);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Create a new project with mock data
    const newProject: Project = {
      id: `project-${Date.now()}`, // Generate a unique ID
      ...validatedData.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("New project created:", newProject);
    return newProject;
  } catch (error) {
    console.error("Error while creating the project:", error);
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

    console.log(`Updating project ${projectId}:`, data);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Get existing project
    const existingProject = await getProjectDetails(projectId);

    // Merge existing data with new data
    const updatedProject: Project = {
      ...existingProject,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    console.log("Project updated successfully:", updatedProject);
    return updatedProject;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};
