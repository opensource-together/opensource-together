import { IconName } from "@/shared/components/ui/icon";

export type ProfileSocialLink = {
  type: IconName;
  url: string;
};

export type ProfileTechStack = {
  id: string;
  name: string;
  iconUrl: string;
  type: "LANGUAGE" | "TECH";
};

export type ProfileBadge = {
  label: string;
  color: string;
  bgColor: string;
};

export type ProfileSkill = {
  name: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  badges: ProfileBadge[];
};

export type ProfileExperience = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
};

export interface ProfileLink {
  type: IconName;
  url: string;
}

// Correspond to GitHub User format
export type Profile = {
  id: string;
  name: string;
  avatarUrl: string;
  jobTitle?: string;
  bio?: string;
  login: string;
  techStacks?: ProfileTechStack[];
  websiteUrl?: string;
  type: string;
  location?: string;
  blog?: string;
  company?: string;
  joinedAt?: string;
  // updatedAt?: string;
  socialLinks?: {
    github?: string;
    discord?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  contributionsCount?: number;
  experiences?: ProfileExperience[];
  links?: ProfileLink[]; // Deprecated - pour compatibilité
};
