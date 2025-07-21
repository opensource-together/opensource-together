import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
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
      projectId: string;
      userId: string;
    },
  ) {}
}

@CommandHandler(AcceptUserApplicationCommand)
export class AcceptUserApplicationCommandHandler
  implements ICommandHandler<AcceptUserApplicationCommand>
{
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
    @Inject(PROJECT_ROLE_APPLICATION_REPOSITORY_PORT)
    private readonly projectRoleApplicationRepository: ProjectRoleApplicationRepositoryPort,
    @Inject(PROJECT_ROLE_REPOSITORY_PORT)
    private readonly projectRoleRepository: ProjectRoleRepositoryPort,
  ) {}

  async execute(command: AcceptUserApplicationCommand) {
    const { projectRoleApplicationId, projectId, userId } = command.props;
    const project: Result<Project, string> =
      await this.projectRepo.findById(projectId);
    console.log('project', project);
    if (!project.success) {
      return Result.fail('Project not found');
    }

    if (!project.value.hasOwnerId(userId)) {
      return Result.fail('User is not the owner of the project');
    }

    const application: Result<ProjectRoleApplication, string> =
      await this.projectRoleApplicationRepository.acceptApplication({
        applicationId: projectRoleApplicationId,
        projectId,
        userId,
      });
    if (!application.success) {
      return Result.fail(application.error);
    }

    const projectRole: Result<ProjectRole, string> =
      await this.projectRoleRepository.findById(
        application.value.projectRoleId,
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

    return Result.ok(application.value);
  }
}
