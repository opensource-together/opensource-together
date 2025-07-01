import {
  Project,
  ProjectCreateProps,
  ProjectValidationErrors,
} from '@/contexts/project/domain/project.entity';
import { Result } from '@/shared/result';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/contexts/project/use-cases/ports/project.repository.port';
import { CommandHandler, ICommand } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { TECHSTACK_REPOSITORY_PORT } from '@/application/teckstack/ports/techstack.repository.port';
import { TechStackRepositoryPort } from '@/application/teckstack/ports/techstack.repository.port';
export class CreateProjectCommand implements ICommand {
  constructor(public readonly props: ProjectCreateProps) {}
}

@CommandHandler(CreateProjectCommand)
export class CreateProjectCommandHandler
  implements ICommandHandler<CreateProjectCommand>
{
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
    @Inject(TECHSTACK_REPOSITORY_PORT)
    private readonly techStackRepo: TechStackRepositoryPort,
  ) {}

  async execute(
    createProjectCommand: CreateProjectCommand,
  ): Promise<Result<Project, ProjectValidationErrors | string>> {
    const { props } = createProjectCommand;
    //check if tech stacks are valid
    const techStackIds = props.techStacks
      .map((ts) => ts.id)
      .filter((id): id is string => id !== undefined);
    const foundTechStacks = await this.techStackRepo.findByIds(techStackIds);
    if (!foundTechStacks.success) {
      return Result.fail('Tech stacks not found');
    }
    if (foundTechStacks.value.length !== props.techStacks.length) {
      return Result.fail('Tech stacks not found');
    }
    //check if project already exists by this title
    const projectWithTitleExists = await this.projectRepo.findProjectByTitle(
      props.title,
    );
    if (projectWithTitleExists.success) {
      return Result.fail('Project with this title already exists');
    }
    //after validate techStacks existence and project title uniqueness,
    // create project entity for business rules
    const project: Result<Project, ProjectValidationErrors | string> =
      Project.create({
        ...props,
      });
    if (!project.success) {
      return Result.fail(project.error);
    }
    //save project in db
    const savedProject = await this.projectRepo.create(project.value);
    if (!savedProject.success) {
      return Result.fail(savedProject.error);
    }
    return Result.ok(savedProject.value);
  }
}
