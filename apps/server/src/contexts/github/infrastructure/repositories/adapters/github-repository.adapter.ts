import { Result } from '@/libs/result';
import { GithubRepositoryDto } from '../dto/github-repository.dto';

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
