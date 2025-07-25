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

export class RejectUserApplicationCommand implements ICommand {
  constructor(
    public readonly props: {
      projectRoleApplicationId: string;
      projectId: string;
      userId: string;
      rejectionReason?: string;
    },
  ) {}
}

@CommandHandler(RejectUserApplicationCommand)
export class RejectUserApplicationCommandHandler
  implements ICommandHandler<RejectUserApplicationCommand>
{
  private readonly Logger = new Logger(RejectUserApplicationCommand.name);
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
    @Inject(PROJECT_ROLE_APPLICATION_REPOSITORY_PORT)
    private readonly projectRoleApplicationRepository: ProjectRoleApplicationRepositoryPort,
  ) {}

  async execute(command: RejectUserApplicationCommand) {
    const { projectRoleApplicationId, projectId, userId } = command.props;
    const project: Result<Project, string> =
      await this.projectRepo.findById(projectId);
    this.Logger.log('project', project);
    if (!project.success) {
      return Result.fail('Project not found');
    }

    if (!project.value.hasOwnerId(userId)) {
      return Result.fail('User is not the owner of the project');
    }

    const application: Result<ProjectRoleApplication, string> =
      await this.projectRoleApplicationRepository.rejectApplication({
        applicationId: projectRoleApplicationId,
        rejectionReason: command.props.rejectionReason || '',
      });
    if (!application.success) {
      return Result.fail(application.error);
    }

    return Result.ok(application.value);
  }
}
