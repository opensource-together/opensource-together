import { ProjectRole } from "@/features/projects/types/project-role.type";
import { Author } from "@/features/projects/types/project.type";

export interface ProjectRoleApplicationType {
  appplicationId: string;
  projectRoleId: string;
  projectRoleTitle: string;
  project: {
    id: string;
    title: string;
    shortDescription: string;
    image?: string;
    author: Author;
  };
  projectRole: ProjectRole;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
  selectedKeyFeatures: {
    feature: string;
  }[];
  selectedProjectGoals: {
    goal: string;
  }[];
  appliedAt: Date;
  decidedAt: Date;
  decidedBy?: string;
  rejectionReason?: string;
  motivationLetter: string;
  userProfile: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}
