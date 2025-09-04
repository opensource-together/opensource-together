import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ProjectService } from './services/project.service';
import { PrismaProjectRepository } from './repositories/prisma.project.repository';
import { ProjectController } from './controllers/project.controller';
import { PROJECT_REPOSITORY } from './repositories/project.repository.interface';
import { TechStackModule } from '../tech-stack/tech-stack.module';
import { CategoryModule } from '../category/category.module';
import { ProjectRoleModule } from '../project-role/project-role.module';
import { GithubModule } from '../github/github.module';
import { MailingModule } from '@/mailing/mailing.module';
@Module({
  imports: [
    PrismaModule,
    TechStackModule,
    CategoryModule,
    ProjectRoleModule,
    GithubModule,
    MailingModule,
  ],
  controllers: [ProjectController],
  providers: [
    {
      provide: PROJECT_REPOSITORY,
      useClass: PrismaProjectRepository,
    },
    ProjectService,
  ],
  exports: [ProjectService],
})
export class ProjectModule {}
