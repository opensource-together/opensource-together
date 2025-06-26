import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { HealthModule } from './health/health.module';
import { GithubModule } from './github/github.module';
import { TechstackModule } from './techstack/techstack.module';
import { ProfileModule } from './profile/profile.module';
import { ProjectRoleModule } from './projectRole/projectRole.module';
@Module({
  imports: [
    ProjectModule,
    HealthModule,
    ProjectRoleModule,
    TechstackModule,
    ProfileModule,
    GithubModule,
  ],
  controllers: [],
  providers: [],
})
export class PresentModule {}
