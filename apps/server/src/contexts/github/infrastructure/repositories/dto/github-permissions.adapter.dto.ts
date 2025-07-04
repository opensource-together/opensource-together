import { Result } from '@/libs/result';
import { GithubRepositoryPermissionsDto } from './github-permissions.dto';

export function toPermissionsDto<
  T extends keyof typeof GithubRepositoryPermissionsDto,
>(input: T): Result<GithubRepositoryPermissionsDto> {
  try {
    const permissions: GithubRepositoryPermissionsDto | undefined =
      GithubRepositoryPermissionsDto[input];
    if (!permissions) {
      return Result.fail(
        `Permissions key ${input} does not exist in GithubRepositoryPermissionsDto`,
      );
    }
    return Result.ok(permissions);
  } catch (e) {
    return Result.fail(`Error : ${e}`);
  }
}
