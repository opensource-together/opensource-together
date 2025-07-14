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
} from '@/contexts/project-role/use-cases/ports/project-role.repository.port';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/contexts/project/use-cases/ports/project.repository.port';
import {
  ProjectRoleApplication,
  ProjectRoleApplicationValidationErrors,
} from '../../domain/project-role-application.entity';
import { ProjectRole } from '@/contexts/project-role/domain/project-role.entity';

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
    @Inject(PROJECT_ROLE_APPLICATION_REPOSITORY_PORT)
    private readonly applicationRepo: ProjectRoleApplicationRepositoryPort,
    @Inject(PROJECT_ROLE_REPOSITORY_PORT)
    private readonly projectRoleRepo: ProjectRoleRepositoryPort,
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
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

    // 4. Valider que les keyFeatures sélectionnées appartiennent au projet
    const projectKeyFeatureIds = projectData.keyFeatures.map((kf) => kf.id!);
    const invalidKeyFeatures = selectedKeyFeatures.filter(
      (id) => !projectKeyFeatureIds.includes(id),
    );
    if (invalidKeyFeatures.length > 0) {
      return Result.fail(
        'Some selected key features do not belong to this project',
      );
    }

    // 5. Valider que les projectGoals sélectionnés appartiennent au projet
    const projectGoalIds = projectData.projectGoals.map((pg) => pg.id!);
    const invalidProjectGoals = selectedProjectGoals.filter(
      (id) => !projectGoalIds.includes(id),
    );
    if (invalidProjectGoals.length > 0) {
      return Result.fail(
        'Some selected project goals do not belong to this project',
      );
    }

    // 6. Vérifier qu'il n'y a pas déjà une candidature PENDING pour ce couple utilisateur/rôle
    const existingApplicationCheck =
      await this.applicationRepo.existsPendingApplication(
        userId,
        projectRoleId,
      );
    if (!existingApplicationCheck.success) {
      return Result.fail(existingApplicationCheck.error);
    }
    if (existingApplicationCheck.value) {
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
      userId,
      projectRoleId,
      selectedKeyFeatures,
      selectedProjectGoals,
      motivationLetter,
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

    return Result.ok(savedApplication.value);
  }
}
