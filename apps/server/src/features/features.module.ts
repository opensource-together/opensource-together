import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { ProjectRoleModule } from './project-role/project-role.module';
import { GithubModule } from './github/github.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { TechStackModule } from './tech-stack/tech-stack.module';

@Module({
  imports: [
    ProjectModule,
    TechStackModule,
    CategoryModule,
    ProjectRoleModule,
    GithubModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
  exports: [
    ProjectModule,
    TechStackModule,
    CategoryModule,
    ProjectRoleModule,
    UserModule,
  ],
})
export class FeaturesModule {}
