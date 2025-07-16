export interface ProjectRoleApplicationType {
  id: string;
  userId: string;
  projectId: string;
  projectRoleId: string;
  projectRoleTitle: string;
  selectedKeyFeatures: string[];
  selectedProjectGoals: string[];
  motivationLetter: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  appliedAt: string;
  userProfile: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}
