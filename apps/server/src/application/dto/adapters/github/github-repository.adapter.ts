import { Result } from '@/shared/result';
import { GithubRepositoryDto } from './github-repository.dto';

export function toGithubRepositoryDto(
  data: unknown,
): Result<GithubRepositoryDto> {
  try {
    const repository = data as GithubRepositoryDto;
    return Result.ok(repository);
  } catch (e) {
    return Result.fail(e);
  }
}
