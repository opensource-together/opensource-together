import { Result } from '@/libs/result';
import { GithubUserDto } from '../dto/github-user.dto';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export function toGithubUserDto(
  data: unknown,
): Result<GithubUserDto> {
  try {
    const user = plainToInstance(GithubUserDto, data);
    const validationErrors = validateSync(user);
    if (validationErrors.length > 0) {
      return Result.fail(validationErrors.toString());
    }
    return Result.ok(user);
  } catch (e) {
    return Result.fail(e);
  }
}
