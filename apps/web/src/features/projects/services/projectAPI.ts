import { get } from "../../../lib/api/fetcher";
import { mockProjects } from "../data/mockProjects";
import { Project } from "../types/projectTypes";

/**
 * Get the list of projects
 */
export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await get<Project[]>("/projects");
    console.log("Response from the API:", response);
    return response;
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
