import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { HealthModule } from './health/health.module';
import { ProjectRoleModule } from './projectRole/projectRole.module';

@Module({
  imports: [ProjectModule, HealthModule, ProjectRoleModule],
  controllers: [],
  providers: [],
})
export class PresentModule {}
