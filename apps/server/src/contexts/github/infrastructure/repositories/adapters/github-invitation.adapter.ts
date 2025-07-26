import { Result } from '@/libs/result';
import { GithubInvitationDto } from '../dto/github-invitation.dto';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export function toGithubInvitationDto(
  data: unknown,
): Result<GithubInvitationDto> {
  try {
    const invitation = plainToInstance(GithubInvitationDto, data);
    const validationErrors = validateSync(invitation);
    if (validationErrors.length > 0) {
      return Result.fail(validationErrors.toString());
    }
    return Result.ok(invitation);
  } catch (e) {
    return Result.fail(e);
  }
}
