import { Result } from '@/libs/result';
import { GithubRepositoryPermissionsDto } from '../dto/github-permissions.dto';

export function toPermissionsDto(
  input: unknown,
): Result<GithubRepositoryPermissionsDto> {
  if (typeof input !== 'string') {
    return Result.fail(`Invalid permission type: ${typeof input}`);
  }

  const upperCaseInput = input.toUpperCase();

  if (upperCaseInput in GithubRepositoryPermissionsDto) {
    const permission =
      GithubRepositoryPermissionsDto[
        upperCaseInput as keyof typeof GithubRepositoryPermissionsDto
      ];
    if (typeof permission === 'number') {
      return Result.ok(permission);
    }
  }

  return Result.fail(
    `Invalid permission: ${input}. Must be one of ${Object.keys(
      GithubRepositoryPermissionsDto,
    )
      .filter((k) => isNaN(Number(k)))
      .join(', ')}`,
  );
}
