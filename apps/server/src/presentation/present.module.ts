import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { HealthModule } from './health/health.module';
import { GithubModule } from './github/github.module';
@Module({
  imports: [ProjectModule, HealthModule, GithubModule],
  controllers: [],
  providers: [],
})
export class PresentModule {}
