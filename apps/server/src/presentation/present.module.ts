import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { HealthModule } from './health/health.module';
@Module({
  imports: [ProjectModule, HealthModule],
  controllers: [],
  providers: [],
})
export class PresentModule {}
