import { ProjectRole } from "@/features/projects/types/project-role.type";
import { TechStack } from "@/features/projects/types/project.type";

import { Owner } from "./../../projects/types/project.type";

export interface MyProjectType {
  id: string;
  title: string;
  shortDescription: string;
  techStacks: TechStack[];
  owner: Owner;
  image?: string;
  status: string;
  applications: ApplicationType[];
  teamMembers: TeamMemberType[];
}

export type ApplicationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELLED";

// Candidature optimisée avec compétences du candidat
export interface ApplicationType {
  id: string;
  status: ApplicationStatus;
  applicant: {
    id: string;
    name: string;
    avatarUrl?: string;
    skills?: TechStack[];
  };
  projectRole: ProjectRole;
  appliedAt: Date;
  decidedAt?: Date;
  decidedBy?: string;
  motivationLetter: string;
  selectedKeyFeatures: Array<{
    id: string;
    feature: string;
  }>;
  selectedProjectGoals: Array<{
    id: string;
    goal: string;
  }>;
  rejectionReason?: string;
}

export interface TeamMemberType {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: string;
  joinedAt: Date;
  techStacks?: Array<{
    id: string;
    name: string;
    iconUrl?: string;
  }>;
}
