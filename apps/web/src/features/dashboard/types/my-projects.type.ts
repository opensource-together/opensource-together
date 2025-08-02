import { ProjectRole } from "@/features/projects/types/project-role.type";

export interface ProjectType {
  id: string;
  title: string;
  shortDescription: string;
  image?: string;
  status: string;
  applications: ApplicationType[];
  teamMembers: TeamMemberType[];
}

export interface ApplicationType {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  applicant: {
    id: string;
    name: string;
    avatarUrl?: string;
    email?: string;
  };
  projectRole: ProjectRole;
  appliedAt: Date;
  decidedAt?: Date;
  motivationLetter: string;
  selectedKeyFeatures: {
    feature: string;
  }[];
  selectedProjectGoals: {
    goal: string;
  }[];
  rejectionReason?: string;
}

export interface TeamMemberType {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  joinedAt: Date;
  techStacks?: Array<{
    id: string;
    name: string;
  }>;
}
