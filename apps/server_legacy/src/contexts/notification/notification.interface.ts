import { ProjectRole, User } from '@prisma/client';

interface BaseNotification {
  object: string;
  message: string;
}

interface ApplyProjectRequest extends BaseNotification {
  appplicationId: string;
  projectRoleId: string;
  projectRoleTitle: string;
  project: {
    id: string;
    title: string;
    shortDescription: string;
    image?: string;
    author: User;
  };
  projectRole: ProjectRole;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  selectedKeyFeatures: {
    feature: string;
  }[];
  selectedProjectGoals: {
    goal: string;
  }[];
  appliedAt: Date;
  decidedAt?: Date;
  decidedBy?: string;
  rejectionReason?: string;
  motivationLetter?: string;
  userProfile: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface ApplyProjectRequestAcceptedNotification
  extends ApplyProjectRequest {
  type: 'project.role.application.accepted';
}

export interface ApplyProjectRequestRejectedNotification
  extends ApplyProjectRequest {
  type: 'project.role.application.rejected';
}

export interface ApplyProjectRequestCreatedNotification
  extends ApplyProjectRequest {
  type: 'project.role.application.created';
}

export interface MessageReceiveNotification extends BaseNotification {
  type: 'message_received';
  payload: {
    userId: string;
    messageId: string;
    text: string;
  };
}

// Interface pour l'événement émis lors de la création d'une candidature
export interface ProjectRoleApplicationCreatedEvent {
  projectOwnerId: string;
  applicantId: string;
  applicantName: string;
  applicantAvatarUrl?: string;
  projectId: string;
  projectTitle: string;
  projectShortDescription: string;
  projectImage?: string;
  projectAuthor: User;
  roleName: string;
  projectRole: ProjectRole;
  applicationId: string;
  selectedKeyFeatures: { feature: string }[];
  selectedProjectGoals: { goal: string }[];
  motivationLetter?: string;
  message: string;
}
