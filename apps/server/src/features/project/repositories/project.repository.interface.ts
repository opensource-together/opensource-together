import { Result } from '@/libs/result';
import { Project } from '../domain/project';

export interface CreateProjectData {
  ownerId: string;
  title: string;
  description: string;
  categories: string[];
  techStacks: string[];
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
  findAll(): Promise<
    Result<
      (Project & { owner: { id: string; name: string; image: string } })[],
      string
    >
  >;
}
