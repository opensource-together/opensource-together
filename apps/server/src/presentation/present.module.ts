import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { GithubModule } from './github/github.module';
import { TechstackModule } from './techstack/techstack.module';
import { ProjectRoleModule } from './projectRole/projectRole.module';
@Module({
  imports: [HealthModule, ProjectRoleModule, TechstackModule, GithubModule],
  controllers: [],
  providers: [],
})
export class PresentModule {}
