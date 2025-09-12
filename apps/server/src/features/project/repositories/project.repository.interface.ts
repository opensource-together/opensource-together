import { Result } from '@/libs/result';
import { Project, ProjectSummary } from '../domain/project';

export interface CreateProjectData {
  ownerId: string;
  title: string;
  description: string;
  categories: string[];
  techStacks: string[];
  keyFeatures: {
    projectId: string;
    feature: string;
  }[];
  projectRoles?: {
    title: string;
    description: string;
    techStacks: string[];
  }[];
  externalLinks?: { type: string; url: string }[];
  image?: string;
  coverImages?: string[];
  readme?: string;
}

export interface UpdateProjectData extends CreateProjectData {
  id: string;
  externalLinks?: { id: string; type: string; url: string }[];
}

export type ProjectRepositoryError =
  | 'PROJECT_NOT_FOUND'
  | 'DUPLICATE_PROJECT'
  | 'UNAUTHORIZED'
  | 'DATABASE_ERROR'
  | 'VALIDATION_FAILED';

export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');

export interface ProjectRepository {
  create(data: CreateProjectData): Promise<Result<Project, string>>;
  findByTitle(title: string): Promise<Result<Project, string>>;
  findById(id: string): Promise<Result<Project, string>>;
  findByRoleId(roleId: string): Promise<Result<Project, string>>;
  findAll(): Promise<Result<ProjectSummary[], string>>;
  findByUserId(userId: string): Promise<Result<Project[], string>>;
  update(
    projectId: string,
    data: UpdateProjectData,
  ): Promise<Result<Project, string>>;
  delete(userId: string, projectId: string): Promise<Result<boolean, string>>;
}
