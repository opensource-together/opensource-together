import { IconName } from "@/shared/components/ui/icon";

export type ProfileSocialLink = {
  type: IconName;
  url: string;
};

export type ProfileTechStack = {
  id: string;
  name: string;
  iconUrl: string;
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

// TODO: Changer les properties pour correspondre a la vison 1 projet = 1 ou plusierus repository
// Correspond to GitHub Repository format
export type ProfileProject = {
  id: string;
  name: string; // repo name
  full_name: string; // owner/repo
  description?: string;
  html_url?: string;
  homepage?: string;
  stargazers_count?: number;
  watchers_count?: number;
  forks_count?: number;
  language?: string;
  topics?: string[];
  created_at?: string;
  updated_at?: string;
  pushed_at?: string;
  image?: string;
  techStacks?: ProfileTechStack[];
};

// Correspond to GitHub User format
export type Profile = {
  id: string;
  name: string;
  login: string;
  avatarUrl: string;
  websiteUrl?: string;
  type: string;
  bio?: string;
  location?: string;
  blog?: string;
  company?: string;
  joinedAt?: string;
  // updatedAt?: string;
  skills?: ProfileSkill[];
  projects?: ProfileProject[];
  socialLinks?: ProfileSocialLink[];
  contributionsCount?: number;
  experiences?: ProfileExperience[];
  links?: ProfileLink[];
};
