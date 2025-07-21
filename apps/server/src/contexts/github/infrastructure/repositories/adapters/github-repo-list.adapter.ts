import { Result } from '@/libs/result';
import { GithubRepoListInput } from '../inputs/github-repo-list.input';
import { GithubRepositoryDto } from '../dto/github-repository.dto';

export function toGithubRepoListInput<T extends GithubRepositoryDto>(
  data: T,
): Result<GithubRepoListInput> {
  try {
    const input: GithubRepoListInput = {
      owner: data.owner.login,
      title: data.name,
      description: data.description,
      url: data.html_url,
    };
    return Result.ok(input);
  } catch (e) {
    return Result.fail(`Error: ${e}`);
  }
}
