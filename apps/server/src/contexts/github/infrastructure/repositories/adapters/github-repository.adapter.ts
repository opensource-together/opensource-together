import { Result } from '@/libs/result';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { GithubRepositoryDto } from '../dto/github-repository.dto';

interface GitHubApiResponse {
  data?: unknown;
}

export function toGithubRepositoryDto(
  data: unknown,
): Result<GithubRepositoryDto> {
  try {
    // GitHub API responses have a 'data' property containing the actual repository data
    const response = data as GitHubApiResponse;
    const repositoryData = response?.data || data;
    const repository = plainToInstance(GithubRepositoryDto, repositoryData);
    const validationErrors = validateSync(repository);
    if (validationErrors.length > 0) {
      return Result.fail(validationErrors.toString());
    }
    return Result.ok(repository);
  } catch (e) {
    return Result.fail(e);
  }
}
