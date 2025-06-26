import { Profile } from '@/domain/profile/profile.entity';
import { ProfileRepositoryPort } from '@/application/profile/ports/profile.repository.port';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/orm/prisma/prisma.service';
import { Result } from '@/shared/result';
import { PrismaProfileMapper } from './prisma.profile.mapper';
import { SocialLink } from '@/domain/profile/social-link.vo';
import { ProfileExperience } from '@/domain/profile/profile-experience.vo';

@Injectable()
export class PrismaProfileRepository implements ProfileRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(profile: {
    userId: string;
    name: string;
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
}
