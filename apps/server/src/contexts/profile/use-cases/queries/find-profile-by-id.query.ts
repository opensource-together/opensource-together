import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ProfileRepositoryPort } from '@/contexts/profile/use-cases/ports/profile.repository.port';
import { PROFILE_REPOSITORY_PORT } from '@/contexts/profile/use-cases/ports/profile.repository.port';
import { Result } from '@/libs/result';
import { USER_REPOSITORY_PORT } from '@/contexts/user/use-cases/ports/user.repository.port';
import { UserRepositoryPort } from '@/contexts/user/use-cases/ports/user.repository.port';
import { Profile } from '@/contexts/profile/domain/profile.entity';
import { User } from '@/contexts/user/domain/user.entity';

export type FullProfileData = {
  profile: Profile;
  user: User;
};

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
  ): Promise<Result<FullProfileData, string>> {
    const [profileResult, userResult] = await Promise.all([
      this.profileRepository.findById(query.id),
      this.userRepository.findById(query.id),
    ]);

    if (!userResult.success) return Result.fail('Utilisateur non trouvé.');
    if (!profileResult.success) return Result.fail('Profil non trouvé.');

    return Result.ok({
      profile: profileResult.value,
      user: userResult.value,
    });
  }
}
