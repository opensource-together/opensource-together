import { Result } from '@/libs/result';
import { GithubUserDto } from '../dto/github-user.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export async function toGithubUserDto(
  data: unknown,
): Promise<Result<GithubUserDto>> {
  try {
    const user = plainToInstance(GithubUserDto, data);
    const validationErrors = await validate(user);
    if (validationErrors.length > 0) {
      return Result.fail(validationErrors.toString());
    }
    return Result.ok(user);
  } catch (e) {
    return Result.fail(e);
  }
}
