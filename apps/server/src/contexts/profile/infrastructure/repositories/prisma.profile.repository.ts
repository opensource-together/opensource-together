import { Profile } from '@/contexts/profile/domain/profile.entity';
import { ProfileRepositoryPort } from '@/contexts/profile/use-cases/ports/profile.repository.port';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/persistence/orm/prisma/services/prisma.service';
import { Result } from '@/libs/result';
import { PrismaProfileMapper } from './prisma.profile.mapper';
import { SocialLink } from '@/contexts/profile/domain/social-link.vo';
import { ProfileExperience } from '@/contexts/profile/domain/profile-experience.vo';

@Injectable()
export class PrismaProfileRepository implements ProfileRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(profile: {
    userId: string;
    name: string;
    login: string;
    avatarUrl: string;
    bio: string;
    location: string;
    company: string;
    socialLinks: SocialLink[];
    experiences: ProfileExperience[];
  }): Promise<Result<Profile, string>> {
    const { profileData, socialLinksData } =
      PrismaProfileMapper.toRepo(profile);

    try {
      const savedRawProfile = await this.prisma.$transaction(async (tx) => {
        await tx.profile.upsert({
          where: { userId: profileData.userId },
          update: profileData,
          create: profileData,
        });

        await tx.userSocialLink.deleteMany({
          where: { userId: profileData.userId },
        });

        if (socialLinksData.length > 0) {
          await tx.userSocialLink.createMany({
            data: socialLinksData.map((link) => ({
              ...link,
              userId: profileData.userId,
            })),
          });
        }

        return tx.profile.findUnique({
          where: { userId: profileData.userId },
          include: { socialLinks: true },
        });
      });

      if (!savedRawProfile) {
        return Result.fail(
          "Erreur technique : Le profil n'a pas pu être retrouvé après sa sauvegarde.",
        );
      }

      const domainProfile = PrismaProfileMapper.toDomain(savedRawProfile);
      return Result.ok(domainProfile);
    } catch (error) {
      console.error(error);
      return Result.fail('Erreur technique lors de la sauvegarde du profil.');
    }
  }

  async findById(id: string): Promise<Result<Profile, string>> {
    try {
      const rawProfile = await this.prisma.profile.findUnique({
        where: { userId: id },
        include: { socialLinks: true },
      });

      if (!rawProfile) {
        return Result.fail('Profil non trouvé.');
      }

      const domainProfile = PrismaProfileMapper.toDomain(rawProfile);
      return Result.ok(domainProfile);
    } catch (error) {
      console.error(error);
      return Result.fail('Erreur technique lors de la recherche du profil.');
    }
  }

  async update(userId: string, profile: Profile): Promise<Result<Profile, string>> {
    const profileData = profile.toPrimitive();
    const { profileData: repoData, socialLinksData } = PrismaProfileMapper.toRepo(profileData);

    try {
      const updatedRawProfile = await this.prisma.$transaction(async (tx) => {
        // Mettre à jour le profil
        await tx.profile.update({
          where: { userId },
          data: {
            name: repoData.name,
            avatarUrl: repoData.avatarUrl,
            bio: repoData.bio,
            location: repoData.location,
            company: repoData.company,
            updatedAt: new Date(),
          },
        });

        // Supprimer les anciens liens sociaux
        await tx.userSocialLink.deleteMany({
          where: { userId },
        });

        // Créer les nouveaux liens sociaux
        if (socialLinksData.length > 0) {
          await tx.userSocialLink.createMany({
            data: socialLinksData.map((link) => ({
              ...link,
              userId,
            })),
          });
        }

        // Retourner le profil mis à jour
        return tx.profile.findUnique({
          where: { userId },
          include: { socialLinks: true },
        });
      });

      if (!updatedRawProfile) {
        return Result.fail('Erreur technique : Le profil n\'a pas pu être retrouvé après sa mise à jour.');
      }

      const domainProfile = PrismaProfileMapper.toDomain(updatedRawProfile);
      return Result.ok(domainProfile);
    } catch (error) {
      console.error(error);
      return Result.fail('Erreur technique lors de la mise à jour du profil.');
    }
  }

  async delete(userId: string): Promise<Result<boolean, string>> {
    try {
      await this.prisma.$transaction(async (tx) => {
        // Supprimer les liens sociaux d'abord (contrainte de clé étrangère)
        await tx.userSocialLink.deleteMany({
          where: { userId },
        });

        // Supprimer le profil
        await tx.profile.delete({
          where: { userId },
        });
      });

      return Result.ok(true);
    } catch (error) {
      console.error(error);
      return Result.fail('Erreur technique lors de la suppression du profil.');
    }
  }
}
