import { ProjectSchema } from "../schema/project.schema";
import { Project } from "../types/ProjectTypes";
import { getProjectDetails } from "./projectAPI";

/**
 * Update a project
 * @param data updated project data
 * @param projectId id of the project to update
 * @returns the updated project
 */
export const updateProject = async (
  data: ProjectSchema,
  projectId: string,
): Promise<Project> => {
  try {
    console.log(`Updating project ${projectId}:`, data);

    // Simule un délai réseau
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Récupère le projet existant (dans un contexte réel, on ferait un PUT/PATCH)
    const existingProject = await getProjectDetails(projectId);

    // Fusionne les données existantes avec les nouvelles
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
