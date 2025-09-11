import { MailingModule } from '@/mailing/mailing.module';
import { MediaModule } from '@/media/media.module';
import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { GithubModule } from './github/github.module';
import { ProjectRoleModule } from './project-role/project-role.module';
import { ProjectModule } from './project/project.module';
import { TechStackModule } from './tech-stack/tech-stack.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    ProjectModule,
    TechStackModule,
    CategoryModule,
    ProjectRoleModule,
    GithubModule,
    UserModule,
    MailingModule,
    MediaModule,
  ],
  controllers: [],
  providers: [],
  exports: [
    ProjectModule,
    TechStackModule,
    CategoryModule,
    ProjectRoleModule,
    UserModule,
    MailingModule,
    MediaModule,
  ],
})
export class FeaturesModule {}
