import { post } from "../../../lib/api/fetcher";
import { Project } from "../types/projectTypes";
import { ProjectSchema } from "../validations/project.schema";

/**
 * Create a new project
 */
export const createProject = async (data: ProjectSchema): Promise<Project> => {
  try {
    const response = await post<ProjectSchema, Project>("/projects", data);
    console.log("Response from the API after creation:", response);
    return response;
  } catch (error) {
    console.error("Error while sending the request to the API:", error);
    throw error;
  }
};
