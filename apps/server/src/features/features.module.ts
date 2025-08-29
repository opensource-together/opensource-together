import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { TechStackModule } from './tech-stack/tech-stack.module';
import { CategoryModule } from './category/category.module';
import { ProjectRoleModule } from './project-role/project-role.module';
import { GithubModule } from './github/github.module';

@Module({
  imports: [
    ProjectModule,
    TechStackModule,
    CategoryModule,
    ProjectRoleModule,
    GithubModule,
  ],
  controllers: [],
  providers: [],
  exports: [ProjectModule, TechStackModule, CategoryModule, ProjectRoleModule],
})
export class FeaturesModule {}
