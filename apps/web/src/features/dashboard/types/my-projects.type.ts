import { ProjectRole } from "@/features/projects/types/project-role.type";

export interface ApplicationReceived {
  id: string;
  projectId: string;
  projectTitle: string;
  projectRole: ProjectRole;
  applicant: {
    id: string;
    name: string;
    avatarUrl?: string;
    email?: string;
  };
  status: "PENDING" | "ACCEPTED" | "REJECTED";
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
