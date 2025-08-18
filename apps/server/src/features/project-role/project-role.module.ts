import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaProjectRoleRepository } from './repositories/prisma.project-role.repository';
import { PROJECT_ROLE_REPOSITORY } from './repositories/project-role.repository.interface';
import { ProjectRoleService } from './services/project-role.service';

@Module({
  imports: [PrismaModule],
  providers: [
    { provide: PROJECT_ROLE_REPOSITORY, useClass: PrismaProjectRoleRepository },
    ProjectRoleService,
  ],
  exports: [PROJECT_ROLE_REPOSITORY, ProjectRoleService],
})
export class ProjectRoleModule {}
