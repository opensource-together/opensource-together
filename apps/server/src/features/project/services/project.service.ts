import { Inject, Injectable, Logger } from '@nestjs/common';
import { Result } from '@/libs/result';
import {
  validateProject,
  validateProjectRole,
  ValidationErrors,
  Project,
} from '../domain/project';
import {
  ProjectRepository,
  UpdateProjectData,
} from '../repositories/project.repository.interface';
import { PROJECT_REPOSITORY } from '../repositories/project.repository.interface';
import { CreateProjectDto } from '../controllers/dto/create-project.dto';
import { UpdateProjectDto } from '../controllers/dto/update-project.dto';
import { TECH_STACK_REPOSITORY } from '@/features/tech-stack/repositories/tech-stack.repository.interface';
import { TechStackRepository } from '@/features/tech-stack/repositories/tech-stack.repository.interface';
import { CATEGORY_REPOSITORY } from '@/features/category/repositories/category.repository.interface';
import { CategoryRepository } from '@/features/category/repositories/category.repository.interface';
import {
  GITHUB_REPOSITORY,
  IGithubRepository,
} from '@/features/github/repositories/github.repository.interface';
import { Octokit } from '@octokit/rest';
import { canUserModifyProject } from '../domain/project';
import { MAILING_SERVICE } from '@/mailing/mailing.interface';
import { MailingServicePort } from '@/mailing/mailing.interface';
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
    private readonly techStackRepository: TechStackRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
    @Inject(GITHUB_REPOSITORY)
    private readonly githubRepository: IGithubRepository,
    @Inject(MAILING_SERVICE)
    private readonly mailingService: MailingServicePort,
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
      if (!validCategories.success) {
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

  async findAll(octokit: Octokit) {
    const result = await this.projectRepository.findAll();
    if (!result.success)
      return Result.fail('DATABASE_ERROR' as ProjectServiceError);
    const projects = await Promise.all(
      result.value.map((project) => this.getProjectStats(octokit, project)),
    );
    const projectsResult: Project[] = [];
    if (projects.some((project) => project.success)) {
      projectsResult.push(
        projects.find((project) => project.success)?.value as Project,
      );
    }
    if (projects.some((project) => !project.success)) {
      return Result.fail('GITHUB_ERROR' as ProjectServiceError);
    }
    console.log('projectsResult', projectsResult);
    return Result.ok(projectsResult);
  }

  async findById(projectId: string, octokit: Octokit) {
    const project = await this.projectRepository.findById(projectId);
    if (!project.success) {
      return Result.fail('PROJECT_NOT_FOUND' as ProjectServiceError);
    }
    console.log('project', project.value);
    const stats = await this.getProjectStats(
      octokit,
      project.value as Project & { owner: { githubLogin: string } },
    );
    if (!stats.success) {
      return Result.fail('GITHUB_ERROR' as ProjectServiceError);
    }
    return Result.ok({
      ...project.value,
      stats: stats.value,
    });
  }

  async update(
    userId: string,
    projectId: string,
    updateProjectDto: UpdateProjectDto,
    octokit: Octokit,
  ) {
    const project = await this.projectRepository.findById(projectId);
    if (!project.success) {
      return Result.fail('PROJECT_NOT_FOUND' as ProjectServiceError);
    }
    if (!canUserModifyProject(project.value, userId))
      return Result.fail('UNAUTHORIZED' as ProjectServiceError);
    const validTechStacks = await this.techStackRepository.findByIds(
      updateProjectDto.techStacks,
    );
    if (!validTechStacks.success) {
      return Result.fail('TECH_STACK_NOT_FOUND' as ProjectServiceError);
    }
    const validCategories = await this.categoryRepository.findByIds(
      updateProjectDto.categories,
    );
    if (!validCategories.success) {
      return Result.fail('CATEGORY_NOT_FOUND' as ProjectServiceError);
    }
    const updatedProject = {
      ...updateProjectDto,
      techStacks: validTechStacks.value.map((ts) => ts.id),
      categories: updateProjectDto.categories,
      externalLinks: updateProjectDto.externalLinks,
    };
    const updatedProjectResult = await this.projectRepository.update(
      projectId,
      updatedProject as unknown as UpdateProjectData,
    );
    if (!updatedProjectResult.success) {
      return Result.fail('DATABASE_ERROR' as ProjectServiceError);
    }
    const githubResult = await this.githubRepository.updateProjectRespository(
      {
        owner: project.value.owner?.githubLogin || '',
        repo: project.value.title.toLowerCase().replace(/\s+/g, '-'),
        title: updateProjectDto.title,
        description: updateProjectDto.description,
      },
      octokit,
    );
    if (!githubResult.success) {
      return Result.fail('GITHUB_ERROR' as ProjectServiceError);
    }
    return Result.ok(updatedProjectResult.value);
  }

  async delete(projectId: string, userId: string) {
    const project = await this.projectRepository.findById(projectId);
    if (!project.success) {
      return Result.fail('PROJECT_NOT_FOUND' as ProjectServiceError);
    }
    if (!canUserModifyProject(project.value, userId))
      return Result.fail('UNAUTHORIZED' as ProjectServiceError);
    const deletedProject = await this.projectRepository.delete(
      userId,
      projectId,
    );
    if (!deletedProject.success) {
      return Result.fail('DATABASE_ERROR' as ProjectServiceError);
    }
    return Result.ok(deletedProject.value);
  }
  async getProjectStats(octokit: Octokit, project: Project) {
    const result = await this.githubRepository.getRepositoryStats(
      octokit,
      project.owner?.githubLogin || '',
      project.title.toLowerCase().replace(/\s+/g, '-'),
    );
    if (!result.success) {
      return Result.fail('GITHUB_ERROR' as ProjectServiceError);
    }
    console.log('result', result.value);
    return Result.ok({
      ...project,
      stats: result.value,
    });
  }
}
