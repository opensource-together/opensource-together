import { Result } from '@/libs/result';
import { GithubRepositoryDto } from '../dto/github-repository.dto';

export function toGithubRepositoryDto(
  data: unknown,
): Result<GithubRepositoryDto> {
  try {
    const repository = data as GithubRepositoryDto;
    if (!repository) {
      return Result.fail(`Repository casting failed for value : ${data}`);
    }
    return Result.ok(repository);
  } catch (e) {
    return Result.fail(e);
  }
}
