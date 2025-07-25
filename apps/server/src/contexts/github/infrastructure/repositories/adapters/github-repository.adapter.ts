import { Result } from '@/libs/result';
import { GithubRepositoryDto } from '../dto/github-repository.dto';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export function toGithubRepositoryDto(
  data: unknown,
): Result<GithubRepositoryDto> {
  try {
    const repository = plainToInstance(GithubRepositoryDto, data);
    const validationErrors = validateSync(repository);
    if (validationErrors.length > 0) {
      return Result.fail(validationErrors.toString());
    }
    return Result.ok(repository);
  } catch (e) {
    return Result.fail(e);
  }
}
