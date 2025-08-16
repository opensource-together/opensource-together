import { Inject, Injectable } from '@nestjs/common';
import {
  ProfileRepositoryPort,
  PROFILE_REPOSITORY_PORT,
} from '../ports/profile.repository.port';
import {
  UserRepositoryPort,
  USER_REPOSITORY_PORT,
} from '@/contexts/user/use-cases/ports/user.repository.port';
import {
  TechStackRepositoryPort,
  TECHSTACK_REPOSITORY_PORT,
} from '@/contexts/techstack/use-cases/ports/techstack.repository.port';
import { Result } from '@/libs/result';
import { Profile } from '../domain/profile.entity';
import { User } from '@/contexts/user/domain/user.entity';
import { UpdateProfileRequestDto } from '../controllers/dtos/update-profile-request.dto';

export type FullProfileData = {
  profile: Profile;
  user: User;
};

@Injectable()
export class ProfileService {
  constructor(
    @Inject(PROFILE_REPOSITORY_PORT)
    private readonly profileRepository: ProfileRepositoryPort,
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(TECHSTACK_REPOSITORY_PORT)
    private readonly techStackRepository: TechStackRepositoryPort,
  ) {}

  async findProfileById(id: string): Promise<Result<FullProfileData, string>> {
    const [profileResult, userResult] = await Promise.all([
      this.profileRepository.findById(id),
      this.userRepository.findById(id),
    ]);

    if (!userResult.success) return Result.fail('Utilisateur non trouvé.');
    if (!profileResult.success) return Result.fail('Profil non trouvé.');

    return Result.ok({
      profile: profileResult.value,
      user: userResult.value,
    });
  }

  async updateProfile(
    userId: string,
    props: UpdateProfileRequestDto,
  ): Promise<Result<Profile, string>> {
    const existingProfileResult = await this.profileRepository.findById(userId);
    if (!existingProfileResult.success) {
      return Result.fail('Profile not found');
    }

    const existingProfile = existingProfileResult.value;
    const existingData = existingProfile.toPrimitive();

    let techStacksData = existingData.techStacks;
    if (props.techStacks) {
      const techStacksResult = await this.techStackRepository.findByIds(
        props.techStacks,
      );
      if (!techStacksResult.success) {
        return Result.fail('Some tech stacks not found');
      }
      techStacksData = techStacksResult.value.map((ts) => ts.toPrimitive());
    }

    const updatedData = {
      userId: existingData.userId,
      name: props.name ?? existingData.name,
      login: existingData.login,
      avatarUrl: props.avatarUrl ?? existingData.avatarUrl,
      bio: props.bio ?? existingData.bio,
      location: props.location ?? existingData.location,
      company: props.company ?? existingData.company,
      experiences: props.experiences,
      techStacks: techStacksData,
      socialLinks: props.socialLinks,
      projects: props.projects,
    };

    const updatedProfileResult = Profile.create(updatedData);
    if (!updatedProfileResult.success) {
      return Result.fail(updatedProfileResult.error);
    }

    const updatedProfile = updatedProfileResult.value;

    const saveResult = await this.profileRepository.update(
      userId,
      updatedProfile,
    );
    if (!saveResult.success) {
      return Result.fail('Unable to update profile');
    }

    return Result.ok(saveResult.value);
  }

  async deleteProfile(userId: string): Promise<Result<boolean, string>> {
    const profileResult = await this.profileRepository.findById(userId);
    if (!profileResult.success) {
      return Result.fail('Profile not found');
    }

    return this.profileRepository.delete(userId);
  }
}
