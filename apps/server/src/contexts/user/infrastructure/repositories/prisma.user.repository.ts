import { Injectable, Logger } from '@nestjs/common';
import { User } from '@/contexts/user/domain/user.entity';
import { PrismaService } from '@/persistence/orm/prisma/services/prisma.service';
import { Result } from '@/libs/result';
import { UserRepositoryPort } from '@/contexts/user/use-cases/ports/user.repository.port';
import { PrismaUserMapper } from './prisma.user.mapper';

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  private readonly Logger = new Logger(PrismaUserRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Result<User, string>> {
    try {
      const userResult = await this.prisma.user.findUnique({
        where: { id },
        include: {
          socialLinks: true,
          techStacks: true,
        },
      });

      if (!userResult) return Result.fail('User not found');

      const user = PrismaUserMapper.toDomain(userResult);
      if (!user.success) return Result.fail(user.error);

      return Result.ok(user.value);
    } catch (error) {
      this.Logger.error('Error finding user by id:', error);
      return Result.fail(
        `Erreur technique lors de la recherche de l'utilisateur : ${error}`,
      );
    }
  }

  async create(user: User): Promise<Result<User, string>> {
    const mappedData = PrismaUserMapper.toRepo(user);
    if (!mappedData.success) return Result.fail(mappedData.error);

    const { userData, socialLinksData } = mappedData.value;

    try {
      const savedUser = await this.prisma.$transaction(async (tx) => {
        // Créer l'utilisateur
        const createdUser = await tx.user.create({
          data: userData,
        });

        // Créer les liens sociaux si nécessaire
        if (socialLinksData.length > 0) {
          await tx.userSocialLink.createMany({
            data: socialLinksData.map((link) => ({
              ...link,
              userId: createdUser.id,
            })),
          });
        }

        // Retourner l'utilisateur avec ses relations
        return tx.user.findUnique({
          where: { id: createdUser.id },
          include: {
            socialLinks: true,
            techStacks: true,
          },
        });
      });

      if (!savedUser) {
        return Result.fail("Erreur lors de la création de l'utilisateur.");
      }

      const userResult = PrismaUserMapper.toDomain(savedUser);
      if (!userResult.success) return Result.fail(userResult.error);

      return Result.ok(userResult.value);
    } catch (error) {
      this.Logger.error('Error creating user:', error);
      return Result.fail(
        `Erreur technique lors de la création de l'utilisateur : ${error}`,
      );
    }
  }

  async findByEmail(email: string): Promise<Result<User, string>> {
    try {
      const userResult = await this.prisma.user.findFirst({
        where: { email },
        include: {
          socialLinks: true,
          techStacks: true,
        },
      });

      if (!userResult) return Result.fail('User not found');

      const user = PrismaUserMapper.toDomain(userResult);
      if (!user.success) return Result.fail(user.error);

      return Result.ok(user.value);
    } catch (error) {
      this.Logger.error('Error finding user by email:', error);
      return Result.fail(
        `Erreur technique lors de la recherche de l'utilisateur : ${error}`,
      );
    }
  }

  async findByUsername(username: string): Promise<Result<User, string>> {
    try {
      const userResult = await this.prisma.user.findFirst({
        where: { username },
        include: {
          socialLinks: true,
          techStacks: true,
        },
      });

      if (!userResult) return Result.fail('User not found');

      const user = PrismaUserMapper.toDomain(userResult);
      if (!user.success) return Result.fail(user.error);

      return Result.ok(user.value);
    } catch (error) {
      this.Logger.error('Error finding user by username:', error);
      return Result.fail(
        `Erreur technique lors de la recherche de l'utilisateur : ${error}`,
      );
    }
  }

  async update(user: User): Promise<Result<User, string>> {
    const mappedData = PrismaUserMapper.toRepo(user);
    if (!mappedData.success) return Result.fail(mappedData.error);

    const { userData, socialLinksData } = mappedData.value;

    try {
      const updatedUser = await this.prisma.$transaction(async (tx) => {
        // Mettre à jour l'utilisateur
        await tx.user.update({
          where: { id: userData.id },
          data: {
            ...userData,
            updatedAt: new Date(),
          },
        });

        // Supprimer les anciens liens sociaux
        await tx.userSocialLink.deleteMany({
          where: { userId: userData.id },
        });

        // Créer les nouveaux liens sociaux
        if (socialLinksData.length > 0) {
          await tx.userSocialLink.createMany({
            data: socialLinksData.map((link) => ({
              ...link,
              userId: userData.id,
            })),
          });
        }

        // Retourner l'utilisateur mis à jour avec ses relations
        return tx.user.findUnique({
          where: { id: userData.id },
          include: {
            socialLinks: true,
            techStacks: true,
          },
        });
      });

      if (!updatedUser) return Result.fail('User not updated');

      const userResult = PrismaUserMapper.toDomain(updatedUser);
      if (!userResult.success) return Result.fail(userResult.error);

      return Result.ok(userResult.value);
    } catch (error) {
      this.Logger.error('Error updating user:', error);
      return Result.fail(
        `Erreur technique lors de la mise à jour de l'utilisateur : ${error}`,
      );
    }
  }

  async delete(user: User): Promise<Result<void, string>> {
    const { id } = user.toPrimitive();

    try {
      await this.prisma.$transaction(async (tx) => {
        // Supprimer les liens sociaux d'abord (contrainte de clé étrangère)
        await tx.userSocialLink.deleteMany({
          where: { userId: id },
        });

        // Supprimer l'utilisateur
        await tx.user.delete({
          where: { id },
        });
      });

      return Result.ok(undefined);
    } catch (error) {
      this.Logger.error('Error deleting user:', error);
      return Result.fail(
        `Erreur technique lors de la suppression de l'utilisateur : ${error}`,
      );
    }
  }

  // Nouvelle méthode pour mettre à jour les tech stacks d'un utilisateur
  async updateTechStacks(
    userId: string,
    techStackIds: string[],
  ): Promise<Result<User, string>> {
    try {
      const updatedUser = await this.prisma.$transaction(async (tx) => {
        // Déconnecter toutes les tech stacks existantes
        await tx.user.update({
          where: { id: userId },
          data: {
            techStacks: {
              set: [], // Déconnecte toutes les relations
            },
          },
        });

        // Connecter les nouvelles tech stacks
        if (techStackIds.length > 0) {
          await tx.user.update({
            where: { id: userId },
            data: {
              techStacks: {
                connect: techStackIds.map((id) => ({ id })),
              },
            },
          });
        }

        // Retourner l'utilisateur mis à jour
        return tx.user.findUnique({
          where: { id: userId },
          include: {
            socialLinks: true,
            techStacks: true,
          },
        });
      });

      if (!updatedUser) {
        return Result.fail('User not found or tech stacks not updated');
      }

      const userResult = PrismaUserMapper.toDomain(updatedUser);
      if (!userResult.success) return Result.fail(userResult.error);

      return Result.ok(userResult.value);
    } catch (error) {
      this.Logger.error('Error updating user tech stacks:', error);
      return Result.fail(
        `Erreur technique lors de la mise à jour des tech stacks : ${error}`,
      );
    }
  }

  async updateGitHubStats(
    userId: string,
    githubStats: {
      totalStars: number;
      contributedRepos: number;
      commitsThisYear: number;
      contributionGraph?: any;
    },
  ): Promise<Result<User, string>> {
    try {
      const userResult = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          socialLinks: true,
          techStacks: true,
        },
      });

      if (!userResult) return Result.fail('User not found');

      // Temporairement utiliser l'ancienne structure en attendant prisma generate
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          githubStats: {
            create: {
              totalStars: githubStats.totalStars,
              contributedRepos: githubStats.contributedRepos,
              commitsThisYear: githubStats.commitsThisYear,
              contributionGraph: githubStats.contributionGraph,
            },
          },
        },
      });

      // Récupérer l'utilisateur mis à jour
      const updatedUserResult = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          socialLinks: true,
          techStacks: true,
        },
      });

      if (!updatedUserResult) return Result.fail('User not found after update');

      const updatedUser = PrismaUserMapper.toDomain(updatedUserResult);
      if (!updatedUser.success) return Result.fail(updatedUser.error);

      return Result.ok(updatedUser.value);
    } catch (error) {
      this.Logger.error('Error updating GitHub stats:', error);
      return Result.fail(
        `Erreur technique lors de la mise à jour des statistiques GitHub : ${error}`,
      );
    }
  }
}
