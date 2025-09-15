import { Owner } from "@/features/projects/types/project.type";

export interface ProjectRoleApplicationType {
  applicationId: string;
  projectRoleId: string;
  projectRoleTitle: string;
  project: {
    id: string;
    title: string;
    description: string;
    image?: string;
    owner: Owner;
  };
  projectRole: {
    id: string;
    projectId: string;
    title: string;
    description: string;
    techStacks: {
      id: string;
      name: string;
      iconUrl: string;
    }[];
    roleCount: number;
  };
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
  selectedKeyFeatures: {
    feature: string;
  }[];

  appliedAt: Date;
  decidedAt?: Date;
  decidedBy?: string;
  rejectionReason?: string;
  motivationLetter: string;
  userProfile: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}
