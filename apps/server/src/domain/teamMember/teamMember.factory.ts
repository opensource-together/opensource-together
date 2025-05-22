import { CreateTeamMemberCommand } from '@/application/teamMember/commands/create/create-team-member.command';
import { TeamMember } from './teamMember.entity';
import { Result } from '@/shared/result';

export default class TeamMemberFactory {
  static create(
    createTeamMemberCommand: CreateTeamMemberCommand,
  ): Result<TeamMember> {
    const teamMember = new TeamMember({
      projectId: createTeamMemberCommand.projectId,
      userId: createTeamMemberCommand.userId,
      projectRoleId: createTeamMemberCommand.projectRoleId,
    });
    return Result.ok(teamMember);
  }

  static createMany(
    teamMembers: CreateTeamMemberCommand[],
  ): Result<TeamMember[]> {
    const teamMembersResult: TeamMember[] = [];
    const errors: string[] = [];

    for (const teamMember of teamMembers) {
      const teamMemberResult = this.create(teamMember);
      if (!teamMemberResult.success) {
        errors.push(teamMemberResult.error);
      } else {
        teamMembersResult.push(teamMemberResult.value);
      }
    }

    if (errors.length > 0) {
      return Result.fail('Erreur lors de la création des membres du projet');
    }

    return Result.ok(teamMembersResult);
  }
}
