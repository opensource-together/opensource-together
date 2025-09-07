import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaProjectRoleRepository } from './repositories/prisma.project-role.repository';
import { PROJECT_ROLE_REPOSITORY } from './repositories/project-role.repository.interface';
import { ProjectRoleService } from './services/project-role.service';
import { ProjectRoleController } from './controllers/project-role.controller';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [PrismaModule, ProjectModule],
  providers: [
    { provide: PROJECT_ROLE_REPOSITORY, useClass: PrismaProjectRoleRepository },
    ProjectRoleService,
  ],
  controllers: [ProjectRoleController],
  exports: [PROJECT_ROLE_REPOSITORY, ProjectRoleService],
})
export class ProjectRoleModule {}
