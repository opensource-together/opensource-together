import { Result } from '@/libs/result';
import { GithubRepositoryDto } from '../dto/github-repository.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export async function toGithubRepositoryDto(
  data: unknown,
): Promise<Result<GithubRepositoryDto>> {
  try {
    const repository = plainToInstance(GithubRepositoryDto, data);
    const validationErrors = await validate(repository);
    if (validationErrors.length > 0) {
      return Result.fail(validationErrors.toString());
    }
    return Result.ok(repository);
  } catch (e) {
    return Result.fail(e);
  }
}
