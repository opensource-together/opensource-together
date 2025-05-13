import { Project } from "./createProjectAPI";
import { ProjectFormData } from "../schema/project.schema";
import { getProjectDetails } from "./projectAPI";

/**
 * Simule la mise à jour d'un projet existant
 * @param projectId Identifiant du projet à mettre à jour
 * @param payload Données mises à jour du projet
 * @returns Le projet mis à jour
 */
export const updateProject = async (
  projectId: string,
  payload: ProjectFormData
): Promise<Project> => {
  try {
    console.log(`Mise à jour du projet ${projectId}:`, payload);
    
    // Simule un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Récupère le projet existant (dans un contexte réel, on ferait un PUT/PATCH)
    const existingProject = await getProjectDetails(projectId);
    
    // Fusionne les données existantes avec les nouvelles
    const updatedProject: Project = {
      ...existingProject,
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    
    console.log("Projet mis à jour avec succès:", updatedProject);
    return updatedProject;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du projet:", error);
    throw error;
  }
}; 