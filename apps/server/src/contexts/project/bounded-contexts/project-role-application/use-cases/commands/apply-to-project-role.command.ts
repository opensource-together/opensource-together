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
  MAILING_SERVICE_PORT,
  MailingServicePort,
  SendEmailPayload,
} from '@/mailing/ports/mailing.service.port';

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
      await this.applicationRepo.existsPendingApplication(
        userId,
        projectRoleId,
      );
    if (
      existingApplicationCheck.success &&
      existingApplicationCheck.value == true
    ) {
      return Result.fail(
        'You already have a pending application for this role',
      );
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
    // 10. Envoyer un email au propriétaire du projet
    const projectOwner = await this.userRepo.findById(projectData.ownerId);
    if (!projectOwner.success) {
      return Result.fail('Unable to find project owner');
    }
    const projectOwnerData = projectOwner.value.toPrimitive();
    const projectOwnerEmail = projectOwnerData.email;
    const projectOwnerUsername = projectOwnerData.username;

    const emailPayload: SendEmailPayload = {
      to: projectOwnerEmail,
      subject: `Nouvelle candidature pour le rôle ${projectRole.toPrimitive().title} dans le projet ${projectData.title}`,
      html: `
        <p>Salut ${projectOwnerUsername},</p>
        <p>Une nouvelle candidature a été soumise pour le rôle ${projectRole.toPrimitive().title} dans votre projet ${projectData.title}.</p>
        <p>Vous pouvez la consulter <a href="${process.env.FRONTEND_URL}/projects/${projectData.id}/applications">ici</a>.</p>
        <p>Cordialement,</p>
        <p>L'équipe Open Source Together</p>
      `,
    };
    await this.mailingService.sendEmail(emailPayload);

    return Result.ok(savedApplication.value);
  }
}
