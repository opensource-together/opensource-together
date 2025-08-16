import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  PROJECT_KEY_FEATURE_REPOSITORY_PORT,
  ProjectKeyFeatureRepositoryPort,
} from '@/contexts/project/bounded-contexts/project-key-feature/use-cases/ports/project-key-feature.repository.port';
import { KeyFeature } from '../../domain/key-feature.entity';
import { Result } from '@/libs/result';
import { Inject, Logger } from '@nestjs/common';
import {
  PROJECT_REPOSITORY_PORT,
  ProjectRepositoryPort,
} from '@/contexts/project/use-cases/ports/project.repository.port';
import { Project } from '@/contexts/project/domain/project.entity';

export class CreateProjectKeyFeatureCommand {
  constructor(
    public readonly props: {
      userId: string;
      projectId: string;
      features: string[];
    },
  ) {}
}

@CommandHandler(CreateProjectKeyFeatureCommand)
export class CreateProjectKeyFeatureCommandHandler
  implements
    ICommandHandler<CreateProjectKeyFeatureCommand, Result<Project, string>>
{
  private readonly Logger = new Logger(CreateProjectKeyFeatureCommand.name);
  constructor(
    @Inject(PROJECT_KEY_FEATURE_REPOSITORY_PORT)
    private readonly projectKeyFeatureRepository: ProjectKeyFeatureRepositoryPort,
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepository: ProjectRepositoryPort,
  ) {}

  async execute(
    command: CreateProjectKeyFeatureCommand,
  ): Promise<Result<Project, string>> {
    const { userId, projectId, features } = command.props;
    this.Logger.log(features);
    const keyFeatureResults = features.map((f) =>
      KeyFeature.create({
        projectId,
        feature: f,
      }),
    );
    if (!keyFeatureResults.every((f) => f.success))
      return Result.fail(
        keyFeatureResults.find((f) => !f.success)?.error as string,
      );
    const projectBeforeUpdate =
      await this.projectRepository.findById(projectId);
    if (!projectBeforeUpdate.success)
      return Result.fail(projectBeforeUpdate.error);
    if (!projectBeforeUpdate.value.hasOwnerId(userId))
      return Result.fail('You are not allowed to update this project');
    const addNewKeyFeatureResult = projectBeforeUpdate.value.updateKeyFeatures(
      keyFeatureResults.map((f) => f.value.toPrimitive()),
    );
    if (!addNewKeyFeatureResult.success)
      return Result.fail(addNewKeyFeatureResult.error);
    const keyFeaturesSaved = await this.projectKeyFeatureRepository.create(
      keyFeatureResults.map((f) => f.value),
    );
    if (!keyFeaturesSaved.success) return Result.fail(keyFeaturesSaved.error);

    const projectAfterUpdate = await this.projectRepository.findById(projectId);
    if (!projectAfterUpdate.success)
      return Result.fail(projectAfterUpdate.error);
    return Result.ok(projectAfterUpdate.value);
  }
}
