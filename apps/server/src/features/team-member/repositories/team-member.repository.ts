import { Result } from '@/libs/result';
import { CreateTeamMemberInputDto } from '../dto/create-team-member.input';
import { TeamMember } from '@prisma/client';

export const TEAM_MEMBER_REPOSITORY = 'TEAM_MEMBER_REPOSITORY';

export interface TeamMemberRepository {
  createTeamMember(
    input: CreateTeamMemberInputDto,
  ): Promise<Result<TeamMember, string>>;

  deleteTeamMember(teamMemberId: string): Promise<Result<boolean, string>>;
}
