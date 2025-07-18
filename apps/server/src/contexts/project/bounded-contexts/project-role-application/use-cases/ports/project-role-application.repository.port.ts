import { Result } from '@/libs/result';
import { ProjectRoleApplication } from '../../domain/project-role-application.entity';

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

  /**
   * Met à jour une candidature existante
   */
  // update(
  //   application: ProjectRoleApplication,
  // ): Promise<Result<ProjectRoleApplication, string>>;

  /**
   * Trouve une candidature par son ID
   */
  // findById(id: string): Promise<Result<ProjectRoleApplication, string>>;

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
  existsPendingApplication(
    userId: string,
    projectRoleId: string,
  ): Promise<Result<boolean, string>>;

  /**
   * Trouve toutes les candidatures pour un projet
   */
  findAllByProjectId(projectId: string): Promise<
    Result<
      {
        appplicationId: string;
        projectRoleId: string;
        projectRoleTitle: string;
        status: string;
        selectedKeyFeatures: string[];
        selectedProjectGoals: string[];
        appliedAt: Date;
        decidedAt: Date;
        decidedBy: string;
        rejectionReason: string;
        userProfile: {
          id: string;
          name: string;
          avatarUrl: string;
        };
      }[],
      string
    >
  >;
}
