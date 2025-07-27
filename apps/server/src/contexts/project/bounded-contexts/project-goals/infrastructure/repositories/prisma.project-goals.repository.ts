import { Logger } from '@nestjs/common';
import { PrismaService } from '@/persistence/orm/prisma/services/prisma.service';
import { Result } from '@/libs/result';
import { ProjectGoalsRepositoryPort } from '../../use-cases/ports/project-goals.repository.port';
import { ProjectGoals } from '../../domain/project-goals.entity';

export class PrismaProjectGoalsRepository
  implements ProjectGoalsRepositoryPort
{
  private readonly Logger = new Logger(PrismaProjectGoalsRepository.name);
  constructor(private readonly prisma: PrismaService) {}
  async updateMany(
    goals: ProjectGoals[],
  ): Promise<Result<ProjectGoals[], string>> {
    try {
      this.Logger.log('updateMany', goals);
      await this.prisma.$transaction(async (tx) => {
        const repoGoals = goals.map((goal) => goal.toPrimitive());

        // Récupérer toutes les keyFeatures existantes pour ce projet
        const projectId = repoGoals[0]?.projectId;
        if (!projectId) throw new Error('Project ID is required');

        const existingGoals = await tx.projectGoal.findMany({
          where: { projectId },
        });
        const existingIds = existingGoals.map((goal) => goal.id);

        // Identifier les opérations à effectuer
        const goalsToCreate = repoGoals.filter(
          (goal) => !goal.id || !existingIds.includes(goal.id),
        );

        const goalsToUpdate = repoGoals.filter(
          (goal) => goal.id && existingIds.includes(goal.id),
        );

        const incomingIds = repoGoals.map((goal) => goal.id).filter(Boolean);
        const goalsToDelete = existingIds.filter(
          (id) => !incomingIds.includes(id),
        );

        // Supprimer les keyFeatures qui ne sont plus dans la liste
        if (goalsToDelete.length > 0) {
          await tx.projectGoal.deleteMany({
            where: { id: { in: goalsToDelete } },
          });
        }

        // Créer les nouvelles keyFeatures
        if (goalsToCreate.length > 0) {
          await tx.projectGoal.createMany({
            data: goalsToCreate.map((goal) => ({
              projectId: projectId,
              goal: goal.goal,
            })),
          });
        }

        // Mettre à jour les keyFeatures existantes
        if (goalsToUpdate.length > 0) {
          for (const goal of goalsToUpdate) {
            await tx.projectGoal.update({
              where: { id: goal.id },
              data: { goal: goal.goal },
            });
          }
        }
      });
      return Result.ok(goals);
    } catch (error) {
      this.Logger.error(error);
      return Result.fail(error);
    }
  }
}
