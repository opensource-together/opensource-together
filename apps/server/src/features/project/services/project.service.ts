import {
  CATEGORY_REPOSITORY,
  ICategoryRepository,
} from '@/features/category/repositories/category.repository.interface';
import { GithubRepository } from '@/features/github/repositories/github.repository';
import { GITHUB_REPOSITORY } from '@/features/github/repositories/github.repository.interface';
import {
  ITechStackRepository,
  TECH_STACK_REPOSITORY,
} from '@/features/tech-stack/repositories/tech-stack.repository.interface';
import { Result } from '@/libs/result';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { CreateProjectDto } from '../controllers/dto/create-project.dto';
import {
  Project,
  validateProject,
  validateProjectRole,
  ValidationErrors,
} from '../domain/project';
import {
  PROJECT_REPOSITORY,
  ProjectRepository,
} from '../repositories/project.repository.interface';

export type CreateProjectRequest = CreateProjectDto;

export type ProjectServiceError =
  | 'PROJECT_NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'VALIDATION_FAILED'
  | 'DATABASE_ERROR'
  | 'GITHUB_ERROR'
  | 'DUPLICATE_PROJECT';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(TECH_STACK_REPOSITORY)
    private readonly techStackRepository: ITechStackRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(GITHUB_REPOSITORY)
    private readonly githubRepository: GithubRepository,
  ) {}

  async createProject(
    request: CreateProjectRequest,
    octokit: Octokit,
  ): Promise<Result<Project, any>> {
    try {
      const existingProject = await this.projectRepository.findByTitle(
        request.title,
      );
      if (existingProject.success) {
        return Result.fail('DUPLICATE_PROJECT' as ProjectServiceError);
      }
      const validTechStacksProject = await this.techStackRepository.findByIds(
        request.techStacks,
      );
      const projectRolesTechStacks = Array.from(
        new Set(
          request.projectRoles?.flatMap((role) =>
            role.techStacks.map((id) => id),
          ),
        ),
      );

      const validTechStacksProjectRoles =
        await this.techStackRepository.findByIds(projectRolesTechStacks);
      if (
        (!validTechStacksProject.success &&
          !validTechStacksProjectRoles.success) ||
        (validTechStacksProject.success &&
          validTechStacksProject.value.length !== request.techStacks.length) ||
        (validTechStacksProjectRoles.success &&
          validTechStacksProjectRoles.value.length !==
            projectRolesTechStacks.length)
      ) {
        return Result.fail('TECH_STACK_NOT_FOUND' as ProjectServiceError);
      }

      const validCategories = await this.categoryRepository.findByIds(
        request.categories,
      );
      if (
        !validCategories.success ||
        validCategories.value.length !== request.categories.length
      ) {
        return Result.fail('CATEGORY_NOT_FOUND' as ProjectServiceError);
      }

      // Validation du projet
      const projectValidation = validateProject({
        ownerId: request.ownerId,
        title: request.title,
        description: request.description,
        techStacks: request.techStacks,
        categories: request.categories,
      });
      if (projectValidation) {
        return Result.fail(projectValidation);
      }
      const projectRolesValidation = request.projectRoles?.map((role) =>
        validateProjectRole({
          title: role.title,
          description: role.description,
          techStacks: role.techStacks,
        }),
      );
      if (projectRolesValidation?.some((validation) => validation)) {
        return Result.fail(
          projectRolesValidation as unknown as ValidationErrors,
        );
      }

      const result = await this.projectRepository.create({
        ownerId: request.ownerId,
        title: request.title,
        image: request.image || '',
        description: request.description,
        categories: request.categories,
        techStacks: request.techStacks,
        projectRoles: request.projectRoles?.map((role) => ({
          title: role.title,
          description: role.description,
          techStacks: role.techStacks.map((id) => id),
        })),
      });

      if (!result.success) {
        return Result.fail('DATABASE_ERROR' as ProjectServiceError);
      }

      const githubResult = await this.githubRepository.createGithubRepository(
        {
          title: request.title,
          description: request.description,
        },
        octokit,
      );

      if (!githubResult.success) {
        return Result.fail('GITHUB_ERROR' as ProjectServiceError);
      }

      return Result.ok(result.value);
    } catch (error) {
      this.logger.error('Error creating project', error);
      return Result.fail('DATABASE_ERROR' as ProjectServiceError);
    }
  }
}
