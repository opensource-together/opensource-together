import { ProjectRoleApplication } from '@/contexts/project/bounded-contexts/project-role-application/domain/project-role-application.entity';
import {
  PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
  ProjectRoleApplicationRepositoryPort,
} from '@/contexts/project/bounded-contexts/project-role-application/use-cases/ports/project-role-application.repository.port';
import { Project } from '@/contexts/project/domain/project.entity';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/contexts/project/use-cases/ports/project.repository.port';
import { Result } from '@/libs/result';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class RejectUserApplicationCommand implements ICommand {
  constructor(
    public readonly props: {
      projectRoleApplicationId: string;
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
    @Inject(EventEmitter2)
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: RejectUserApplicationCommand) {
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
    if (!projectResult.success) {
      return Result.fail('Project not found');
    }

    const project = projectResult.value;
    if (!project.hasOwnerId(userId)) {
      return Result.fail('User is not the owner of the project');
    }
    const applicationRejected: Result<ProjectRoleApplication, string> =
      await this.projectRoleApplicationRepository.rejectApplication({
        applicationId: projectRoleApplicationId,
        rejectionReason: command.props.rejectionReason || '',
      });
    if (!applicationRejected.success) {
      return Result.fail(applicationRejected.error);
    }

    this.eventEmitter.emit('project.role.application.rejected', {
      object: 'Le statut de la candidature a été mis à jour',
      payload: {
        applicantId: application.toPrimitive().userProfile.id,
        applicantName: application.toPrimitive().userProfile.username,
        projectId: application.toPrimitive().projectId,
        projectTitle: project.toPrimitive().title,
        roleName: project.toPrimitive().title,
        message: `Votre candidature pour le rôle ${project.toPrimitive().title} a été rejetée.`,
      },
    });

    return Result.ok(application);
  }
}
