import { Result } from '@/libs/result';
import { ProjectRole } from '../../domain/project-role.entity';

export const PROJECT_ROLE_REPOSITORY_PORT = Symbol('ProjectRoleRepository');

export interface ProjectRoleRepositoryPort {
  /**
   * Crée un nouveau rôle de projet
   */
  create(projectRole: ProjectRole): Promise<Result<ProjectRole, string>>;

  /**
   * Met à jour un rôle de projet existant
   */
  update(projectRole: ProjectRole): Promise<Result<ProjectRole, string>>;

  /**
   * Trouve un rôle de projet par son ID
   */
  findById(id: string): Promise<Result<ProjectRole, string>>;

  /**
   * Trouve tous les rôles d'un projet
   */
  // findByProjectId(projectId: string): Promise<Result<ProjectRole[], string>>;

  /**
   * Trouve un rôle spécifique dans un projet
   */
  // findByProjectIdAndRoleId(
  //   projectId: string,
  //   roleId: string,
  // ): Promise<Result<ProjectRole, string>>;

  /**
   * Supprime un rôle de projet
   */
  delete(id: string): Promise<Result<boolean, string>>;

  /**
   * Vérifie si un rôle existe dans un projet
   */
  // existsByProjectIdAndRoleTitle(
  //   projectId: string,
  //   roleTitle: string,
  // ): Promise<Result<boolean, string>>;
}
