import { mockProjects } from "../data/mockProjects";
import { Project } from "../types/projectTypes";

/**
 * Get project details by project ID
 */
export const getProjectDetails = async (
  projectId: string,
): Promise<Project> => {
  // In a real scenario, this would call the API
  // return get<Project>(`/projects/${projectId}`);
  // For now, return mock data
  return Promise.resolve(
    mockProjects.find((p) => p.id === projectId) || mockProjects[0],
  );
};

/**
 * Get all projects (for listing)
 */
export const getAllProjects = async (): Promise<Project[]> => {
  // In a real scenario, this would call the API
  // return get<Project[]>('/projects');

  // For now, return mock data
  return Promise.resolve(mockProjects);
};
