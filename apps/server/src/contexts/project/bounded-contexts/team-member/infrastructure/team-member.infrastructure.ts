import { Module } from '@nestjs/common';
import { PersistenceInfrastructure } from '@/persistence/persistence.infrastructure';
import { TEAM_MEMBER_REPOSITORY_PORT } from '../use-cases/ports/team-member.repository.port';
import { PrismaTeamMemberRepository } from './repositories/prisma.team-member.repository';
import { teamMemberUseCases } from '../use-cases/team-member.use-cases';

@Module({
  imports: [PersistenceInfrastructure],
  providers: [
    ...teamMemberUseCases,
    {
      provide: TEAM_MEMBER_REPOSITORY_PORT,
      useClass: PrismaTeamMemberRepository,
    },
  ],
  exports: [TEAM_MEMBER_REPOSITORY_PORT],
})
export class TeamMemberInfrastructure {}
