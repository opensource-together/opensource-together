import { Result } from "@/shared/result";
import { GithubRepositoryDto } from "./github-repository.dto";
import { toGithubUserDto } from "./github-user.adapter";

export function toGithubRepositoryDto(data: any): Result<GithubRepositoryDto> {
  try {
    const owner = toGithubUserDto(data.owner);
    if(!owner.success) {
      return Result.fail(owner.error);
    }
    const repository: GithubRepositoryDto = {
      id: data.id,
      node_id: data.node_id,
      name: data.name,
      full_name: data.full_name,
      owner: owner.value,
      html_url: data.html_url,
      description: data.description,
    }
    return Result.ok(repository);
  } catch(e) {
    return Result.fail(e);
  }
}
