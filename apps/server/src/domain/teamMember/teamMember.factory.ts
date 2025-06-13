import { TeamMember } from './teamMember.entity';
import { Result } from '@/shared/result';

export default class TeamMemberFactory {
  static create(createTeamMemberCommand: {
    userId: string;
  }): Result<TeamMember> {
    const teamMember = new TeamMember({
      projectId: '',
      userId: createTeamMemberCommand.userId,
    });
    return Result.ok(teamMember);
  }

  static createMany(
    teamMembers: {
      userId: string;
    }[],
  ): Result<TeamMember[]> {
    const teamMembersResult: TeamMember[] = [];

    for (const teamMember of teamMembers) {
      const teamMemberResult = this.create({
        userId: teamMember.userId,
      });
      if (!teamMemberResult.success) {
        return Result.fail(teamMemberResult.error);
      }
      teamMembersResult.push(teamMemberResult.value);
    }
    return Result.ok(teamMembersResult);
  }

  static fromPersistence(
    teamMembers: {
      id: string;
      projectId: string;
      userId: string;
      joinedAt: Date;
    }[],
  ): Result<TeamMember[]> {
    const teamMembersResult: TeamMember[] = [];
    const errors: string[] = [];

    for (const teamMember of teamMembers) {
      try {
        const teamMemberResult = new TeamMember({
          id: teamMember.id,
          projectId: teamMember.projectId,
          userId: teamMember.userId,
          joinedAt: teamMember.joinedAt,
        });
        teamMembersResult.push(teamMemberResult);
      } catch (error) {
        errors.push(`${error}`);
      }
    }

    if (errors.length > 0) {
      return Result.fail(
        `Erreur lors de la création des membres du projet: ${errors.join(', ')}`,
      );
    }

    return Result.ok(teamMembersResult);
  }
}
