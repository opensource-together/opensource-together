import { ProjectRole } from '@/contexts/project/bounded-contexts/project-role/domain/project-role.entity';
import {
  PROJECT_ROLE_REPOSITORY_PORT,
  ProjectRoleRepositoryPort,
} from '@/contexts/project/bounded-contexts/project-role/use-cases/ports/project-role.repository.port';
import { Project } from '@/contexts/project/domain/project.entity';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/contexts/project/use-cases/ports/project.repository.port';
import {
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from '@/contexts/user/use-cases/ports/user.repository.port';
import { Result } from '@/libs/result';
import {
  MAILING_SERVICE_PORT,
  MailingServicePort,
} from '@/mailing/ports/mailing.service.port';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProjectGoals } from '../../../project-goals/domain/project-goals.entity';
import { KeyFeature } from '../../../project-key-feature/domain/key-feature.entity';
import {
  ProjectRoleApplication,
  ProjectRoleApplicationValidationErrors,
} from '../../domain/project-role-application.entity';
import {
  PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
  ProjectRoleApplicationRepositoryPort,
} from '../ports/project-role-application.repository.port';

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
    const projectResult: Result<Project, string> =
      await this.projectRepo.findById(projectRole.toPrimitive().projectId!);
    if (!projectResult.success) {
      return Result.fail('Project not found');
    }
    const project = projectResult.value;
    const projectData = project.toPrimitive();

    // 4. Valider et récupérer les keyFeatures sélectionnées
    const validKeyFeatures: KeyFeature[] = [];
    for (const selectedId of selectedKeyFeatures) {
      if (!project.hasKeyFeature(selectedId)) {
        return Result.fail(
          'Some selected key features do not belong to this project',
        );
      }
      const keyFeatureResult = project.getKeyFeature(selectedId);
      if (!keyFeatureResult.success) {
        return Result.fail(keyFeatureResult.error);
      }
      validKeyFeatures.push(keyFeatureResult.value);
    }

    // 5. Valider et récupérer les projectGoals sélectionnés
    const validProjectGoals: ProjectGoals[] = [];
    for (const selectedId of selectedProjectGoals) {
      if (!project.hasProjectGoal(selectedId)) {
        return Result.fail(
          'Some selected project goals do not belong to this project',
        );
      }
      const projectGoalResult = project.getProjectGoal(selectedId);
      if (!projectGoalResult.success) {
        return Result.fail(projectGoalResult.error);
      }
      validProjectGoals.push(projectGoalResult.value);
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

    // 8. Récupérer les informations de l'utilisateur candidat
    const userResult = await this.userRepo.findById(userId);
    if (!userResult.success) {
      return Result.fail('User not found');
    }
    const userData = userResult.value.toPrimitive();

    // 9. Récupérer les informations de l'utilisateur propriétaire du projet
    const projectOwnerResult = await this.userRepo.findById(
      projectData.ownerId,
    );
    if (!projectOwnerResult.success) {
      return Result.fail('Project owner not found');
    }
    const projectOwnerData = projectOwnerResult.value.toPrimitive();

    // 10. Créer la candidature
    const applicationResult = ProjectRoleApplication.create({
      projectId: projectData.id!,
      project: {
        id: projectData.id!,
        title: projectData.title,
        shortDescription: projectData.shortDescription,
        description: projectData.description,
        image: projectData.image,
        owner: {
          id: projectOwnerData.id,
          username: projectOwnerData.username,
          login: projectOwnerData.login,
          email: projectOwnerData.email,
          provider: projectOwnerData.provider,
          jobTitle: projectOwnerData.jobTitle,
          location: projectOwnerData.location,
          company: projectOwnerData.company,
          bio: projectOwnerData.bio,
          createdAt: projectOwnerData.createdAt || new Date(),
          updatedAt: projectOwnerData.updatedAt || new Date(),
          avatarUrl: projectOwnerData.avatarUrl,
        },
      },
      projectRoleTitle: projectRole.toPrimitive().title,
      projectRoleId,
      selectedKeyFeatures: validKeyFeatures.map((kf) => ({
        id: kf.toPrimitive().id!,
        feature: kf.toPrimitive().feature,
      })),
      selectedProjectGoals: validProjectGoals.map((pg) => ({
        id: pg.toPrimitive().id!,
        goal: pg.toPrimitive().goal,
      })),
      motivationLetter,
      userProfile: {
        id: userId,
        username: userData.username,
        avatarUrl: userData.avatarUrl,
      },
    });

    if (!applicationResult.success) {
      return Result.fail(applicationResult.error);
    }

    // 11. Sauvegarder la candidature
    const savedApplication = await this.applicationRepo.create(
      applicationResult.value,
    );
    if (!savedApplication.success) {
      return Result.fail('Unable to create application');
    }

    // 12. Émettre l'événement de candidature pour déclencher les notifications
    const savedApplicationData = savedApplication.value.toPrimitive();
    this.eventEmitter.emit('project.role.application.created', {
      projectOwnerId: projectData.ownerId,
      applicantId: userId,
      applicantName: userData.username,
      applicantAvatarUrl: userData.avatarUrl,
      projectId: projectData.id!,
      projectTitle: projectData.title,
      projectShortDescription: projectData.shortDescription,
      projectImage: projectData.image,
      projectAuthor: projectOwnerData,
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
