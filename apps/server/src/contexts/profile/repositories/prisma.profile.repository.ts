/*import { Profile } from '../domain/profile.entity';
import { ProfileRepositoryPort } from '../ports/profile.repository.port';
import { Result } from '@/libs/result';
import { PrismaService } from '@/persistence/orm/prisma/services/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaProfileMapper } from './prisma.profile.mapper';

@Injectable()
export class PrismaProfileRepository implements ProfileRepositoryPort {
  private readonly logger = new Logger(PrismaProfileRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Result<Profile, string>> {
    try {
      const rawProfile = await this.prisma.profile.findUnique({
        where: { userId: id },
        include: {
          socialLinks: true,
          techStacks: true,
          experiences: true,
          projects: true,
        },
      });

      if (!rawProfile) {
        return Result.fail('Profil non trouvé.');
      }

      const domainProfile = PrismaProfileMapper.toDomain(rawProfile);
      if (!domainProfile.success) {
        return Result.fail(domainProfile.error);
      }
      return Result.ok(domainProfile.value);
    } catch (error) {
      this.logger.error(error);
      return Result.fail('Erreur technique lors de la recherche du profil.');
    }
  }

  async update(
    userId: string,
    profile: Profile,
  ): Promise<Result<Profile, string>> {
    const {
      profileData,
      socialLinksData,
      experiencesData,
      projectsData,
      techStackIds,
    } = PrismaProfileMapper.toPersistence(profile);

    try {
      const updatedRawProfile = await this.prisma.$transaction(async (tx) => {
        await tx.profile.update({
          where: { userId },
          data: {
            ...profileData,
            updatedAt: new Date(),
          },
        });

        await tx.userSocialLink.deleteMany({ where: { userId } });
        if (socialLinksData.length > 0) {
          await tx.userSocialLink.createMany({
            data: socialLinksData.map((link) => ({ ...link, userId })),
          });
        }

        await tx.profileExperience.deleteMany({ where: { profileUserId: userId } });
        if (experiencesData.length > 0) {
          await tx.profileExperience.createMany({
            data: experiencesData.map((exp) => ({
              ...exp,
              profileUserId: userId,
            })),
          });
        }

        await tx.profileProject.deleteMany({ where: { profileUserId: userId } });
        if (projectsData.length > 0) {
          await tx.profileProject.createMany({
            data: projectsData.map((p) => ({ ...p, profileUserId: userId })),
          });
        }

        await tx.profile.update({
          where: { userId },
          data: {
            techStacks: {
              set: techStackIds.map((id) => ({ id })),
            },
          },
        });

        return tx.profile.findUnique({
          where: { userId },
          include: {
            socialLinks: true,
            techStacks: true,
            experiences: true,
            projects: true,
          },
        });
      });

      if (!updatedRawProfile) {
        return Result.fail(
          "Erreur: Le profil n'a pas pu être retrouvé après sa mise à jour.',
        );
      }

      const domainProfile = PrismaProfileMapper.toDomain(updatedRawProfile);
      if (!domainProfile.success) {
        return Result.fail(domainProfile.error);
      }

      return Result.ok(domainProfile.value);
    } catch (error) {
      this.logger.error('Error updating profile:', error);
      return Result.fail('Erreur technique lors de la mise à jour du profil.');
    }
  }

  async delete(userId: string): Promise<Result<boolean, string>> {
    try {
      await this.prisma.profile.delete({ where: { userId } });
      return Result.ok(true);
    } catch (error) {
      this.logger.error('Error deleting profile:', error);
      return Result.fail('Erreur technique lors de la suppression du profil.');
    }
  }
}*/
