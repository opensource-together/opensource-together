export interface TechStack {
  id: string;
  name: string;
  iconUrl?: string;
}

export interface Badge {
  label: string;
}

export interface ProjectRole {
  id?: string;
  title: string;
  description: string;
  badges: Badge[];
}

export interface SocialLink {
  type: "github" | "website" | "discord" | "twitter" | "other";
  url: string;
}

export interface CommunityStats {
  contributors?: number;
  stars?: number;
  forks?: number;
}

// Interface Project complète
export interface Project {
  id?: string;
  slug?: string;
  title: string;
  image?: string;
  projectImages?: string[];
  authorName?: string;
  authorImage?: string;
  description: string;
  longDescription?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  difficulty?: "Facile" | "Moyenne" | "Difficile";
  techStacks: TechStack[];
  roles?: ProjectRole[];
  socialLinks?: SocialLink[];
  communityStats?: CommunityStats;
  keyBenefits?: string[];
  keyFeatures?: string[];
  projectGoals?: string[];
  categories?: string[];
  lastCommit?: string; // temporary nullable
  createdAt?: string;
  updatedAt?: string;
}
