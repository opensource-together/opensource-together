import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { ProjectRoleModule } from './project-role/project-role.module';
import { ProjectModule } from './project/project.module';
import { TechStackModule } from './tech-stack/tech-stack.module';
import { MailingModule } from '@/mailing/mailing.module';

@Module({
  imports: [
    ProjectModule,
    TechStackModule,
    CategoryModule,
    ProjectRoleModule,
    MailingModule,
  ],
  controllers: [],
  providers: [],
  exports: [
    ProjectModule,
    TechStackModule,
    CategoryModule,
    ProjectRoleModule,
    MailingModule,
  ],
})
export class FeaturesModule {}
