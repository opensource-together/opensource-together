import { Result } from '@/shared/result';
import { GithubUserDto } from './github-user.dto';

export function toGithubUserDto(data: unknown): Result<GithubUserDto> {
  try {
    const user: GithubUserDto = data as GithubUserDto;
    return Result.ok(user);
  } catch (e) {
    return Result.fail(e);
  }
}
