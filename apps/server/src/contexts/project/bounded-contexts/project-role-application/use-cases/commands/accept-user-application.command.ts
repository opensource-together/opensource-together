import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import {
  PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
  ProjectRoleApplicationRepositoryPort,
} from '@/contexts/project/bounded-contexts/project-role-application/use-cases/ports/project-role-application.repository.port';
import { Result } from '@/libs/result';
import { Project } from '@/contexts/project/domain/project.entity';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/contexts/project/use-cases/ports/project.repository.port';
import { ProjectRoleApplication } from '@/contexts/project/bounded-contexts/project-role-application/domain/project-role-application.entity';
import {
  PROJECT_ROLE_REPOSITORY_PORT,
  ProjectRoleRepositoryPort,
} from '../../../project-role/use-cases/ports/project-role.repository.port';
import { ProjectRole } from '@/contexts/project/bounded-contexts/project-role/domain/project-role.entity';

export class AcceptUserApplicationCommand implements ICommand {
  constructor(
    public readonly props: {
      projectRoleApplicationId: string;
      userId: string;
    },
  ) {}
}

@CommandHandler(AcceptUserApplicationCommand)
export class AcceptUserApplicationCommandHandler
  implements ICommandHandler<AcceptUserApplicationCommand>
{
  private readonly Logger = new Logger(AcceptUserApplicationCommand.name);
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
    @Inject(PROJECT_ROLE_APPLICATION_REPOSITORY_PORT)
    private readonly projectRoleApplicationRepository: ProjectRoleApplicationRepositoryPort,
    @Inject(PROJECT_ROLE_REPOSITORY_PORT)
    private readonly projectRoleRepository: ProjectRoleRepositoryPort,
  ) {}

  async execute(command: AcceptUserApplicationCommand) {
    const { projectRoleApplicationId, userId } = command.props;
    const applicationResult: Result<ProjectRoleApplication, string> =
      await this.projectRoleApplicationRepository.findById(
        projectRoleApplicationId,
      );
    if (!applicationResult.success) {
      return Result.fail(applicationResult.error);
    }
    const application = applicationResult.value;

    const projectResult: Result<Project, string> =
      await this.projectRepo.findById(application.toPrimitive().projectId);
    this.Logger.log('project', projectResult);
    if (!projectResult.success) {
      return Result.fail('Project not found');
    }

    const project = projectResult.value;
    if (!project.hasOwnerId(userId)) {
      return Result.fail('User is not the owner of the project');
    }

    const acceptedApplication: Result<ProjectRoleApplication, string> =
      await this.projectRoleApplicationRepository.acceptApplication({
        applicationId: projectRoleApplicationId,
        projectId: application.toPrimitive().projectId,
        userId,
      });
    if (!acceptedApplication.success) {
      return Result.fail(acceptedApplication.error);
    }

    const projectRole: Result<ProjectRole, string> =
      await this.projectRoleRepository.findById(
        acceptedApplication.value.projectRoleId,
      );

    if (!projectRole.success) {
      return Result.fail(projectRole.error);
    }
    projectRole.value.markAsFilled();

    const updatedProjectRole: Result<ProjectRole, string> =
      await this.projectRoleRepository.update(projectRole.value);
    if (!updatedProjectRole.success) {
      return Result.fail(updatedProjectRole.error);
    }

    return Result.ok(acceptedApplication.value);
  }
}
