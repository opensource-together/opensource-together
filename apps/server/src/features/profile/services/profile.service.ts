import { Injectable } from '@nestjs/common';
import { PrismaProfileRepository } from '@/features/profile/repositories/prisma.profile.repository';
import { Account } from 'better-auth/types';
import { FromGithubDto } from '@/features/profile/dto/from-github.dto';
import { UpsertProfileDto } from '@/features/profile/controllers/dto/upsert-profile.dto';
import { Result } from '@/libs/result';
import { Profile as DomainProfile } from '@/features/profile/domain/profile';
import { CompleteProfile } from '@/features/profile/repositories/profile.repository.interface';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: PrismaProfileRepository) {}

  async createFromGithub(account: Account): Promise<Result<boolean, string>> {
    const res: Response = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${account.accessToken}` },
    });

    if (!res.ok) {
      return Result.fail('Failed to fetch user from github');
    }
    const gh = (await res.json()) as FromGithubDto;

    try {
      await this.profileRepository.upsert({
        userId: account.userId,
        bio: gh.bio || undefined,
        location: gh.location || undefined,
        company: gh.company || undefined,
        jobTitle: gh.login || undefined,
      });
    } catch (error) {
      return Result.fail(`Failed to create profile: ${error}`);
    }

    return Result.ok(true);
  }

  async upsertProfile(
    userId: string,
    data: UpsertProfileDto,
  ): Promise<Result<DomainProfile, string>> {
    if (!userId) {
      return Result.fail('You must be logged in to update your profile');
    }

    try {
      return await this.profileRepository.upsert({
        userId,
        bio: data.bio,
        location: data.location,
        company: data.company,
        jobTitle: data.jobTitle,
      });
    } catch (error) {
      return Result.fail(`Failed to update profile: ${error}`);
    }
  }

  async getProfileByUserId(
    userId: string,
  ): Promise<Result<CompleteProfile, string>> {
    if (!userId) {
      return Result.fail('You must be logged in to get your profile');
    }

    try {
      return await this.profileRepository.getProfileByUserId(userId);
    } catch (error) {
      return Result.fail(`Failed to get profile: ${error}`);
    }
  }

  async deleteProfile(userId: string): Promise<Result<boolean, string>> {
    if (!userId) {
      return Result.fail('You must be logged in to delete your profile');
    }

    try {
      await this.profileRepository.deleteByUserId(userId);
    } catch (error) {
      return Result.fail(`Failed to delete profile: ${error}`);
    }
    
    return Result.ok(true);
  }
}
