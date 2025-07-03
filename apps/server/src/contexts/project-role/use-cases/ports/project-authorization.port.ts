import { Result } from '@/shared/result';

export const PROJECT_AUTHORIZATION_PORT = Symbol('PROJECT_AUTHORIZATION_PORT');

export interface ProjectAuthorizationPort {
  /**
   * Vérifie si l'utilisateur est le propriétaire du projet
   */
  isProjectOwner(
    projectId: string,
    userId: string,
  ): Promise<Result<boolean, string>>;

  /**
   * Vérifie si le projet existe
   */
  projectExists(projectId: string): Promise<Result<boolean, string>>;
}
