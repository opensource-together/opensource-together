export type ApplicationStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELLED';
export type ApplicationProjectRole = {
  id: string;
  userId: string;
  projectId: string;
  projectRoleId: string;
  status: ApplicationStatus;
  motivationLetter: string | null;
  rejectionReason?: string | null;
  appliedAt?: string;
  decidedAt?: string;
  decidedBy?: string;
};
