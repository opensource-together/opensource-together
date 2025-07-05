import { Result } from '@/libs/result';
import { GithubRepositoryDto } from './github-repository.dto';

export function toGithubRepositoryDto(
  data: unknown,
): Result<GithubRepositoryDto> {
  try {
    const repository = data as { data: GithubRepositoryDto };
    console.log('repository', repository);
    return Result.ok(repository.data);
  } catch (e) {
    return Result.fail(e);
  }
}
