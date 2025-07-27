import { Project } from "@/features/projects/types/project.type";

export type ProfileSocialLinks = {
  github?: string;
  website?: string;
  twitter?: string;
  discord?: string;
  linkedin?: string;
};

export type ProfileTechStack = {
  id: string;
  name: string;
  iconUrl: string;
  type: "LANGUAGE" | "TECH";
};

export type ProfileExperience = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
};

export type Profile = {
  id: string;
  name: string;
  avatarUrl: string;
  jobTitle?: string;
  bio?: string;
  location?: string;
  company?: string;
  contributionsCount?: number;
  socialLinks?: ProfileSocialLinks;
  techStacks?: ProfileTechStack[];
  experiences?: ProfileExperience[];
  projects?: Project[];
  joinedAt?: string;
  profileUpdatedAt?: string;
};
