import { Result } from '@/libs/result';
import { TeamMember } from '../../domain/team-member.entity';

export const TEAM_MEMBER_REPOSITORY_PORT = Symbol(
  'TEAM_MEMBER_REPOSITORY_PORT',
);

export interface TeamMemberRepositoryPort {
  create(teamMember: TeamMember): Promise<Result<TeamMember, string>>;
  findByProjectId(projectId: string): Promise<Result<TeamMember[], string>>;
  findByUserId(userId: string): Promise<Result<TeamMember[], string>>;
  findByProjectIdAndUserId(
    projectId: string,
    userId: string,
  ): Promise<Result<TeamMember | null, string>>;
  delete(id: string): Promise<Result<boolean, string>>;
  addRoleToMember(
    memberId: string,
    roleId: string,
  ): Promise<Result<TeamMember, string>>;
}
