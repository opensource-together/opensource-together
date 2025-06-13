import { Result } from '@/shared/result';
import { GithubUserDto } from './github-user.dto';

export function toGithubUserDto(data: any): Result<GithubUserDto> {
  try {
    const user: GithubUserDto = {
      login: data.login,
      id: data.id,
      node_id: data.node_id,
      avatar_url: data.avatar_url,
      html_url: data.html_url,
    };
    return Result.ok(user);
  } catch (e) {
    return Result.fail(e);
  }
}
