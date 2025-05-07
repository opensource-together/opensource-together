import { post, get } from "../../../lib/api/fetcher";

// Interface TechStack pour les stacks technologiques
export interface TechStack {
  id: string;
  name: string;
  iconUrl: string;
}

// Interface Project complète
export interface Project {
  id?: string;
  title: string;
  description: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  techStacks: TechStack[];
}

/**
 * Récupère la liste des projets
 */
export const getProjects = async (): Promise<Project[]> => {
  return get<Project[]>("/projects");
};

/**
 * Crée un nouveau projet
 */
export const createProject = async (payload: Project): Promise<Project> => {
  return post<Project, Project>("/projects", payload);
}; 