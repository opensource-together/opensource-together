import { get, post } from "../../../lib/api/fetcher";

// Interface TechStack pour les stacks technologiques
export interface TechStack {
  id: string;
  name: string;
  iconUrl: string;
}

export interface Badge {
  label: string;
  color: string;
  bgColor: string;
}

export interface ProjectRole {
  id: string;
  title: string;
  description: string;
  badges: Badge[];
  experienceBadge?: string;
}

export interface SocialLink {
  type: "github" | "website" | "discord" | "twitter" | "other";
  url: string;
}

export interface CommunityStats {
  contributors: number;
  stars: number;
  forks: number;
}

// Interface Project complète
export interface Project {
  id?: string;
  slug?: string;
  title: string;
  description: string;
  longDescription?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  techStacks: TechStack[];
  roles?: ProjectRole[];
  socialLinks?: SocialLink[];
  communityStats?: CommunityStats;
  keyBenefits?: string[];
  createdAt?: string;
  updatedAt?: string;
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
