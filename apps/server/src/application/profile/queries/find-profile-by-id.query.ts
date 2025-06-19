import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ProfileRepositoryPort } from '../ports/profile.repository.port';
import { PROFILE_REPOSITORY_PORT } from '../ports/profile.repository.port';
import { Result } from '@/shared/result';
import { USER_REPOSITORY_PORT } from '@/application/user/ports/user.repository.port';
import { UserRepositoryPort } from '@/application/user/ports/user.repository.port';
import { ProfileResponseDto } from '../dtos/profile-response.dto';

export class FindProfileByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(FindProfileByIdQuery)
export class FindProfileByIdQueryHandler
  implements IQueryHandler<FindProfileByIdQuery>
{
  constructor(
    @Inject(PROFILE_REPOSITORY_PORT)
    private readonly profileRepository: ProfileRepositoryPort,
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(
    query: FindProfileByIdQuery,
  ): Promise<Result<ProfileResponseDto, string>> {
    const [profileResult, userResult] = await Promise.all([
      this.profileRepository.findById(query.id),
      this.userRepository.findById(query.id),
    ]);

    if (!userResult.success) return Result.fail('Utilisateur non trouvé.');
    if (!profileResult.success) return Result.fail('Profil non trouvé.');

    const userState = userResult.value.getState();
    const profileState = profileResult.value.getState();

    const responseDto: ProfileResponseDto = {
      id: profileState.userId,
      name: profileState.name,
      avatarUrl: profileState.avatarUrl,
      bio: profileState.bio,
      location: profileState.location,
      company: profileState.company,
      socialLinks: profileState.socialLinks,
      skills: profileState.skills,
      experiences: profileState.experiences,
      joinedAt: userState.createdAt?.toISOString() ?? '',
      profileUpdatedAt: profileState.updatedAt.toISOString(),
    };

    return Result.ok(responseDto);
  }
}
