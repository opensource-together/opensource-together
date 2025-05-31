import { Result } from "@/shared/result";
import { GithubRepositoryPermissionsDto } from "./github-permissions.dto";

export function toPermissionsDto(input: string): Result<GithubRepositoryPermissionsDto> {
  const permissions: GithubRepositoryPermissionsDto|undefined = GithubRepositoryPermissionsDto[input];
  if(!permissions) {
    return Result.fail(`Permissions key ${input} does not exist in GithubRepositoryPermissionsDto`); 
  }
  return Result.ok(permissions);
}
