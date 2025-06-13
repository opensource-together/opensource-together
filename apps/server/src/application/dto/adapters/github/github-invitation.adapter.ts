import { Result } from '@/shared/result';
import { GithubInvitationDto } from './github-invitation.dto';
import { toGithubUserDto } from './github-user.adapter';
import { GithubRepositoryDto } from './github-repository.dto';
import { toGithubRepositoryDto } from './github-repository.adapter';
import { toPermissionsDto } from './github-permissions.adapter.dto';

export function toGithubInvitationDto(data: any): Result<GithubInvitationDto> {
  try {
    const repository = toGithubRepositoryDto(data.repository);
    if (!repository.success) {
      return Result.fail(repository.error);
    }
    const inviter = toGithubUserDto(data.inviter);
    if (!inviter.success) {
      return Result.fail(inviter.error);
    }
    const invitee = toGithubUserDto(data.invitee);
    if (!invitee.success) {
      return Result.fail(invitee.error);
    }
    const permissions = toPermissionsDto(data.permissions);
    if (!permissions.success) {
      return Result.fail(permissions.error);
    }
    const invitation: GithubInvitationDto = {
      id: data.id,
      node_id: data.node_id,
      repository: repository.value,
      inviter: inviter.value,
      invitee: invitee.value,
      permissions: permissions.value,
      html_url: data.html_url,
    };
    return Result.ok(invitation);
  } catch (e) {
    return Result.fail(e);
  }
}
