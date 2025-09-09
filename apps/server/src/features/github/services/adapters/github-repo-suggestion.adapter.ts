import { Result } from '@/libs/result';
import { GithubRepoSuggestionInput } from '../inputs/github-repo-suggestion.input';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { GithubRepositoryDto } from '../dto/github-repository.dto';

export function toGithubRepoSuggestionInput<T extends GithubRepositoryDto>(
  data: T,
): Result<GithubRepoSuggestionInput> {
  try {
    const response = {
      owner: data.owner.login,
      title: data.name,
      description: data.description,
      url: data.html_url,
      readme: data.readme,
    };
    const input = plainToInstance(GithubRepoSuggestionInput, response);
    const validationErrors = validateSync(input);
    if (validationErrors.length > 0) {
      return Result.fail(validationErrors.toString());
    }
    return Result.ok(input);
  } catch (e) {
    return Result.fail(e);
  }
}
