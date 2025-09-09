import { Inject, Injectable } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../repositories/user.repository.interface';
import { Result } from '@/libs/result';
import { Account } from 'better-auth/types';
import { FromGithubDto } from '@/features/profile/dto/from-github.dto';
@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async updateGithubLogin(account: Account): Promise<Result<void, string>> {
    const res: Response = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${account.accessToken}` },
    });

    if (!res.ok) throw new Error('Failed to fetch user from github');
    const gh = (await res.json()) as FromGithubDto;

    return this.userRepository.updateGithubLogin(account.userId, gh.login);
  }
}
