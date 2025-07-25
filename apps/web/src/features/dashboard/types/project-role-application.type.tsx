export interface ProjectRoleApplicationType {
  appplicationId: string;
  projectRoleId: string;
  projectRoleTitle: string;
  projectTitle: string;
  status: "PENDING" | "APPROVAL" | "ACCEPTED" | "REJECTED";
  selectedKeyFeatures: string[];
  selectedProjectGoals: string[];
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
