import { Result } from '@/libs/result';
import { GithubRepoListInput } from '../inputs/github-repo-list.input';
import { GithubRepositoryDto } from '../dto/github-repository.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export async function toGithubRepoListInput<T extends GithubRepositoryDto>(
  data: T,
): Promise<Result<GithubRepoListInput>> {
  try {
    const input = plainToInstance(GithubRepoListInput, data);
    const validationErrors = await validate(input);
    if (validationErrors.length > 0) {
      return Result.fail(validationErrors.toString());
    }
    return Result.ok(input);
  } catch (e) {
    return Result.fail(e);
  }
}
