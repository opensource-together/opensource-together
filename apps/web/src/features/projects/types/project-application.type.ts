export interface ProjectRoleApplication {
  id: string;
  userId: string;
  projectId: string;
  projectRoleId: string;
  projectRoleTitle: string;
  selectedKeyFeatures: string[]; // Array des features sélectionnées
  selectedProjectGoals: string[]; // Array des goals sélectionnés
  motivationLetter?: string; // Lettre de motivation optionnelle
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  appliedAt: string;
  userProfile: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}
