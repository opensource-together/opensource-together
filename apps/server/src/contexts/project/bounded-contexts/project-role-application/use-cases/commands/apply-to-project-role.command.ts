import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import {
  PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
  ProjectRoleApplicationRepositoryPort,
} from '../ports/project-role-application.repository.port';
import {
  PROJECT_ROLE_REPOSITORY_PORT,
  ProjectRoleRepositoryPort,
} from '@/contexts/project/bounded-contexts/project-role/use-cases/ports/project-role.repository.port';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/contexts/project/use-cases/ports/project.repository.port';
import {
  ProjectRoleApplication,
  ProjectRoleApplicationValidationErrors,
} from '../../domain/project-role-application.entity';
import { ProjectRole } from '@/contexts/project/bounded-contexts/project-role/domain/project-role.entity';
import { USER_REPOSITORY_PORT } from '@/contexts/user/use-cases/ports/user.repository.port';
import { UserRepositoryPort } from '@/contexts/user/use-cases/ports/user.repository.port';
import {
  PROFILE_REPOSITORY_PORT,
  ProfileRepositoryPort,
} from '@/contexts/profile/use-cases/ports/profile.repository.port';
import {
  MAILING_SERVICE_PORT,
  MailingServicePort,
} from '@/mailing/ports/mailing.service.port';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class ApplyToProjectRoleCommand implements ICommand {
  constructor(
    public readonly props: {
      userId: string;
      projectRoleId: string;
      selectedKeyFeatures: string[];
      selectedProjectGoals: string[];
      motivationLetter?: string;
    },
  ) {}
}

@CommandHandler(ApplyToProjectRoleCommand)
export class ApplyToProjectRoleCommandHandler
  implements ICommandHandler<ApplyToProjectRoleCommand>
{
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
    @Inject(PROFILE_REPOSITORY_PORT)
    private readonly profileRepo: ProfileRepositoryPort,
    @Inject(PROJECT_ROLE_APPLICATION_REPOSITORY_PORT)
    private readonly applicationRepo: ProjectRoleApplicationRepositoryPort,
    @Inject(PROJECT_ROLE_REPOSITORY_PORT)
    private readonly projectRoleRepo: ProjectRoleRepositoryPort,
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
    @Inject(MAILING_SERVICE_PORT)
    private readonly mailingService: MailingServicePort,
    @Inject(EventEmitter2)
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    command: ApplyToProjectRoleCommand,
  ): Promise<
    Result<
      ProjectRoleApplication,
      ProjectRoleApplicationValidationErrors | string
    >
  > {
    const {
      userId,
      projectRoleId,
      selectedKeyFeatures,
      selectedProjectGoals,
      motivationLetter,
    } = command.props;

    // 1. Vérifier que le rôle existe
    const roleResult: Result<ProjectRole, string> =
      await this.projectRoleRepo.findById(projectRoleId);
    if (!roleResult.success) {
      return Result.fail('Project role not found');
    }
    const projectRole = roleResult.value;

    // 2. Vérifier que le rôle n'est pas déjà rempli
    if (projectRole.toPrimitive().isFilled) {
      return Result.fail('This role is already filled');
    }

    // 3. Récupérer le projet pour valider les keyFeatures et projectGoals
    const projectResult = await this.projectRepo.findById(
      projectRole.toPrimitive().projectId!,
    );
    if (!projectResult.success) {
      return Result.fail('Project not found');
    }
    const project = projectResult.value;
    const projectData = project.toPrimitive();

    // 4. Valider et récupérer les keyFeatures sélectionnées
    const validKeyFeatures: string[] = [];
    for (const selectedId of selectedKeyFeatures) {
      const keyFeature = projectData.keyFeatures.find(
        (kf) => kf.id === selectedId,
      );
      if (!keyFeature) {
        return Result.fail(
          'Some selected key features do not belong to this project',
        );
      }
      validKeyFeatures.push(keyFeature.feature);
    }

    // 5. Valider et récupérer les projectGoals sélectionnés
    const validProjectGoals: string[] = [];
    for (const selectedId of selectedProjectGoals) {
      const projectGoal = projectData.projectGoals.find(
        (pg) => pg.id === selectedId,
      );
      if (!projectGoal) {
        return Result.fail(
          'Some selected project goals do not belong to this project',
        );
      }
      validProjectGoals.push(projectGoal.goal);
    }

    // 6. Vérifier qu'il n'y a pas déjà une candidature PENDING pour ce couple utilisateur/rôle
    const existingApplicationCheck =
      await this.applicationRepo.existsStatusApplication(userId, projectRoleId);
    if (existingApplicationCheck.success) {
      if (existingApplicationCheck.value === 'PENDING') {
        return Result.fail(
          'You already have a pending application for this role',
        );
      }
      if (existingApplicationCheck.value === 'REJECTED') {
        return Result.fail(
          'You already have a rejected application for this role',
        );
      }
    }

    // 7. Vérifier que l'utilisateur ne candidate pas à son propre projet
    if (projectData.ownerId === userId) {
      return Result.fail('You cannot apply to your own project');
    }

    // 8. Créer la candidature
    const applicationResult = ProjectRoleApplication.create({
      projectId: projectData.id!,
      projectRoleTitle: projectRole.toPrimitive().title,
      projectRoleId,
      selectedKeyFeatures: validKeyFeatures,
      selectedProjectGoals: validProjectGoals,
      motivationLetter,
      userProfile: {
        id: userId,
        name: '', // Sera rempli par le mapper depuis le profile
        avatarUrl: undefined,
      },
    });

    if (!applicationResult.success) {
      return Result.fail(applicationResult.error);
    }

    // 9. Sauvegarder la candidature
    const savedApplication = await this.applicationRepo.create(
      applicationResult.value,
    );
    if (!savedApplication.success) {
      return Result.fail('Unable to create application');
    }
    // 10. Récupérer le profil de l'auteur du projet pour l'événement
    const projectOwner = await this.userRepo.findById(projectData.ownerId);
    if (!projectOwner.success) {
      return Result.fail('Unable to find project owner');
    }

    const projectAuthorProfileResult = await this.profileRepo.findById(
      projectData.ownerId,
    );
    if (!projectAuthorProfileResult.success) {
      return Result.fail('Project owner profile not found');
    }
    const projectAuthorProfile = projectAuthorProfileResult.value.toPrimitive();

    // Émettre l'événement de candidature pour déclencher les notifications
    const savedApplicationData = savedApplication.value.toPrimitive();
    this.eventEmitter.emit('project.role.application.created', {
      projectOwnerId: projectData.ownerId,
      applicantId: userId,
      applicantName: savedApplicationData.userProfile.name,
      projectId: projectData.id!,
      projectTitle: projectData.title,
      projectShortDescription: projectData.shortDescription,
      projectImage: projectData.image,
      projectAuthor: projectAuthorProfile,
      roleName: projectRole.toPrimitive().title,
      projectRole: projectRole.toPrimitive(),
      applicationId: savedApplicationData.id,
      selectedKeyFeatures: validKeyFeatures.map((feature) => ({ feature })),
      selectedProjectGoals: validProjectGoals.map((goal) => ({ goal })),
      motivationLetter: motivationLetter,
      message: `Une nouvelle candidature a été soumise pour le rôle ${projectRole.toPrimitive().title} dans votre projet ${projectData.title}.`,
    });

    return Result.ok(savedApplication.value);
  }
}
