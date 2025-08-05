import { API_BASE_URL } from "@/config/config";

import { MyProjectType } from "../types/my-projects.type";

/**
 * Récupère les projets de l'utilisateur courant avec leurs détails
 *
 * @returns Promise<MyProjectType[]> - Liste des projets avec détails
 */
export const getMyProjects = async (): Promise<MyProjectType[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/me/projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch my projects");
    }

    const data = await response.json();

    // Convertir les dates string en objets Date
    return data.map((project: any) => ({
      ...project,
      applications: project.applications?.map((app: any) => ({
        ...app,
        appliedAt: new Date(app.appliedAt),
        decidedAt: app.decidedAt ? new Date(app.decidedAt) : undefined,
      })) || [],
      teamMembers: project.teamMembers?.map((member: any) => ({
        ...member,
        joinedAt: new Date(member.joinedAt),
      })) || [],
    }));
  } catch (error) {
    console.error("Error fetching my projects:", error);
    throw error;
  }
}; 