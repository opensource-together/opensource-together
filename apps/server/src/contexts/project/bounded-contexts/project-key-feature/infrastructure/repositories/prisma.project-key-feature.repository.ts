import { Logger } from '@nestjs/common';
import { PrismaService } from '@/persistence/orm/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { KeyFeature } from '@/contexts/project/bounded-contexts/project-key-feature/domain/key-feature.entity';
import { ProjectKeyFeatureRepositoryPort } from '@/contexts/project/bounded-contexts/project-key-feature/use-cases/ports/project-key-feature.repository.port';
import { Result } from '@/libs/result';
import { Prisma } from '@prisma/client';
import { PrismaProjectKeyFeatureMapper } from '@/contexts/project/bounded-contexts/project-key-feature/infrastructure/repositories/prisma.project-key-feature.mapper';

@Injectable()
export class PrismaProjectKeyFeatureRepository
  implements ProjectKeyFeatureRepositoryPort
{
private readonly Logger = new Logger(PrismaProjectKeyFeatureRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(
    keyFeatures: KeyFeature[],
  ): Promise<Result<KeyFeature[], string>> {
    try {
      const repoKeyFeatures = keyFeatures.map((kf) =>
        PrismaProjectKeyFeatureMapper.toRepo(kf),
      );
      const keyFeaturesToCreate = repoKeyFeatures.map((kf) => ({
        projectId: kf.projectId,
        feature: kf.feature,
      }));
      const savedKeyFeatures = await this.prisma.keyFeature.createMany({
        data: keyFeaturesToCreate,
      });
      if (savedKeyFeatures.count !== keyFeatures.length)
        return Result.fail('Failed to create key feature');
      return Result.ok(keyFeatures);
    } catch {
      return Result.fail('Failed to create key feature');
    }
  }

  async delete(keyFeature: KeyFeature): Promise<Result<KeyFeature, string>> {
    try {
      const repoKeyFeature = PrismaProjectKeyFeatureMapper.toRepo(keyFeature);
      await this.prisma.keyFeature.delete({
        where: { id: repoKeyFeature.id },
      });
      return Result.ok(keyFeature);
    } catch {
      return Result.fail('Une erreur est survenue lors de la suppression');
    }
  }

  async update(keyFeature: KeyFeature): Promise<Result<KeyFeature, string>> {
    try {
      const repoKeyFeature = PrismaProjectKeyFeatureMapper.toRepo(keyFeature);
      const toRepo: Prisma.KeyFeatureUpdateInput = {
        feature: repoKeyFeature.feature,
      };
      const updatedKeyFeature = await this.prisma.keyFeature.update({
        where: { id: repoKeyFeature.id },
        data: toRepo,
      });
      const toDomain =
        PrismaProjectKeyFeatureMapper.toDomain(updatedKeyFeature);
      if (!toDomain.success) return Result.fail(toDomain.error);
      return Result.ok(toDomain.value);
    } catch {
      return Result.fail('Une erreur est survenue lors de la mise à jour');
    }
  }

  async updateMany(
    keyFeatures: KeyFeature[],
  ): Promise<Result<KeyFeature[], string>> {
    try {
      this.Logger.log('updateMany', keyFeatures);
      await this.prisma.$transaction(async (tx) => {
        const repoKeyFeatures = keyFeatures.map((kf) =>
          PrismaProjectKeyFeatureMapper.toRepo(kf),
        );

        // Récupérer toutes les keyFeatures existantes pour ce projet
        const projectId = repoKeyFeatures[0]?.projectId;
        if (!projectId) throw new Error('Project ID is required');

        const existingKeyFeatures = await tx.keyFeature.findMany({
          where: { projectId },
        });
        const existingIds = existingKeyFeatures.map((kf) => kf.id);

        // Identifier les opérations à effectuer
        const keyFeaturesToCreate = repoKeyFeatures.filter(
          (kf) => !kf.id || !existingIds.includes(kf.id),
        );

        const keyFeaturesToUpdate = repoKeyFeatures.filter(
          (kf) => kf.id && existingIds.includes(kf.id),
        );

        const incomingIds = repoKeyFeatures.map((kf) => kf.id).filter(Boolean);
        const keyFeaturesToDelete = existingIds.filter(
          (id) => !incomingIds.includes(id),
        );

        // Supprimer les keyFeatures qui ne sont plus dans la liste
        if (keyFeaturesToDelete.length > 0) {
          await tx.keyFeature.deleteMany({
            where: { id: { in: keyFeaturesToDelete } },
          });
        }

        // Créer les nouvelles keyFeatures
        if (keyFeaturesToCreate.length > 0) {
          await tx.keyFeature.createMany({
            data: keyFeaturesToCreate.map((kf) => ({
              projectId: projectId,
              feature: kf.feature,
            })),
          });
        }

        // Mettre à jour les keyFeatures existantes
        if (keyFeaturesToUpdate.length > 0) {
          for (const kf of keyFeaturesToUpdate) {
            await tx.keyFeature.update({
              where: { id: kf.id },
              data: { feature: kf.feature },
            });
          }
        }
      });
      return Result.ok(keyFeatures);
    } catch (error) {
      this.Logger.error(error);
      return Result.fail(error);
    }
  }
}
