import { Result } from '@/libs/result';
import { GithubRepoListInput } from '../inputs/github-repo-list.input';
import { GithubRepositoryDto } from '../dto/github-repository.dto';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export function toGithubRepoListInput<T extends GithubRepositoryDto>(
  data: T,
): Result<GithubRepoListInput> {
  try {
    const input = plainToInstance(GithubRepoListInput, data);
    const validationErrors = validateSync(input);
    if (validationErrors.length > 0) {
      return Result.fail(validationErrors.toString());
    }
    return Result.ok(input);
  } catch (e) {
    return Result.fail(e);
  }
}
