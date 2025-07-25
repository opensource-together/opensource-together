import { Result } from '@/libs/result';
import { GithubRepositoryPermissionsDto } from '../dto/github-permissions.dto';

export function toPermissionsDto(
  input: any,
): Result<GithubRepositoryPermissionsDto> {
  if (Object.values(GithubRepositoryPermissionsDto).includes(input)) {
    return Result.ok(input as GithubRepositoryPermissionsDto);
  }
  return Result.fail(
    `Invalid permission: ${input}. Must be one of ${Object.values(
      GithubRepositoryPermissionsDto,
    ).join(', ')}`,
  );
}
