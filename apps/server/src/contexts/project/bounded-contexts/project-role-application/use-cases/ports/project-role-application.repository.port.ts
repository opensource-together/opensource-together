import { ProjectRoleApplication } from '@/contexts/project/bounded-contexts/project-role-application/domain/project-role-application.entity';
import { Result } from '@/libs/result';

export const PROJECT_ROLE_APPLICATION_REPOSITORY_PORT = Symbol(
  'ProjectRoleApplicationRepository',
);

export interface ProjectRoleApplicationRepositoryPort {
  /**
   * Crée une nouvelle candidature
   */
  create(
    application: ProjectRoleApplication,
  ): Promise<Result<ProjectRoleApplication, string>>;

  findAllByUserId(userId: string): Promise<
    Result<
      {
        appplicationId: string;
        projectRoleId: string;
        projectRoleTitle: string;
        project: {
          id: string;
          title: string;
          shortDescription: string;
          image?: string;
          owner: {
            id: string;
            username: string;
            login: string;
            email: string;
            provider: string;
            createdAt: Date;
            updatedAt: Date;
            avatarUrl: string;
          };
        };
        projectRole: {
          id: string;
          projectId?: string;
          title: string;
          description: string;
          techStacks: {
            id: string;
            name: string;
            iconUrl?: string;
          }[];
          roleCount?: number;
          projectGoal?: {
            id?: string;
            projectId?: string;
            goal: string;
          }[];
        };
        status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
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
      }[],
      string
    >
  >;
  /**
   * Met à jour une candidature existante
   */
  // update(
  //   application: ProjectRoleApplication,
  // ): Promise<Result<ProjectRoleApplication, string>>;

  /**
   * Trouve une candidature par son ID
   */
  findById(id: string): Promise<Result<ProjectRoleApplication, string>>;

  /**
   * Trouve toutes les candidatures d'un utilisateur
   */
  // findByUserId(
  //   userId: string,
  // ): Promise<Result<ProjectRoleApplication[], string>>;

  /**
   * Trouve toutes les candidatures pour un projet
   */
  // findByProjectId(
  //   projectId: string,
  // ): Promise<Result<ProjectRoleApplication[], string>>;

  /**
   * Trouve une candidature spécifique pour un rôle et un utilisateur
   */
  // findByUserIdAndProjectRoleId(
  //   userId: string,
  //   projectRoleId: string,
  // ): Promise<Result<ProjectRoleApplication, string>>;

  /**
   * Supprime une candidature
   */
  // delete(id: string): Promise<Result<boolean, string>>;

  /**
   * Vérifie si une candidature PENDING existe déjà pour ce couple utilisateur/rôle
   */
  // existsPendingApplication(
  //   userId: string,
  //   projectRoleId: string,
  // ): Promise<Result<boolean, string>>;

  existsStatusApplication(
    userId: string,
    projectRoleId: string,
  ): Promise<Result<string | undefined, string>>;
  /**
   * Trouve toutes les candidatures pour un projet
   */
  findAllByProjectId(projectId: string): Promise<
    Result<
      {
        appplicationId: string;
        projectRoleId: string;
        projectRoleTitle: string;
        project: {
          id: string;
          title: string;
          shortDescription: string;
          image?: string;
          owner: {
            id: string;
            username: string;
            login: string;
            email: string;
            provider: string;
            createdAt: Date;
            updatedAt: Date;
            avatarUrl: string;
          };
        };
        projectRole: {
          id: string;
          projectId?: string;
          title: string;
          description: string;
          techStacks: {
            id: string;
            name: string;
            iconUrl?: string;
          }[];
          roleCount?: number;
          projectGoal?: {
            id?: string;
            projectId?: string;
            goal: string;
          }[];
        };
        status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
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
      }[],
      string
    >
  >;

  /**
   * Trouve une candidature par son ID
   */
  findByRoleId(roleId: string): Promise<
    Result<
      {
        appplicationId: string;
        projectRoleId: string;
        projectRoleTitle: string;
        projectRoleDescription: string;
        status: string;
        selectedKeyFeatures: { id: string; feature: string }[];
        selectedProjectGoals: { id: string; goal: string }[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy: string;
        rejectionReason: string;
        motivationLetter: string;
        userProfile: {
          id: string;
          username: string;
          avatarUrl: string;
        };
      }[],
      string
    >
  >;

  rejectApplication(props: {
    applicationId: string;
    rejectionReason: string;
  }): Promise<Result<ProjectRoleApplication, string>>;

  acceptApplication(props: {
    applicationId: string;
    projectId: string;
    userId: string;
  }): Promise<Result<ProjectRoleApplication, string>>;
}
