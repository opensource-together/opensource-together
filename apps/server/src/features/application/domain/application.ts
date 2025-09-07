export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type User = {
  id: string;
  name: string;
  avatarUrl: string;
};
export type Application = {
  id: string;
  user: User;
  projectId: string;
  projectRoleId: string;
  status: ApplicationStatus;
  motivationLetter: string;
  rejectionReason: string;
  appliedAt: string;
  decidedAt: string;
  decidedBy: User;
};
