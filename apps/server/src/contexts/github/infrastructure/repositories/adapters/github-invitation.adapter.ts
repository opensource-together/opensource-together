import { Result } from '@/libs/result';
import { GithubInvitationDto } from '../dto/github-invitation.dto';

export function toGithubInvitationDto(
  data: unknown,
): Result<GithubInvitationDto> {
  try {
    const invitation = data as GithubInvitationDto;
    if (!invitation) {
      return Result.fail(`Invitation casting failed for value : ${data}`);
    }
    return Result.ok(invitation);
  } catch (e) {
    return Result.fail(e);
  }
}
