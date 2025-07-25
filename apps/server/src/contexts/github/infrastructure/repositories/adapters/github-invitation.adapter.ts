import { Result } from '@/libs/result';
import { GithubInvitationDto } from '../dto/github-invitation.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export async function toGithubInvitationDto(
  data: unknown,
): Promise<Result<GithubInvitationDto>> {
  try {
    const invitation = plainToInstance(GithubInvitationDto, data);
    const validationErrors = await validate(invitation);
    if (validationErrors.length > 0) {
      return Result.fail(validationErrors.toString());
    }
    return Result.ok(invitation);
  } catch (e) {
    return Result.fail(e);
  }
}
