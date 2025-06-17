import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [ProjectModule, HealthModule, UserModule],
  controllers: [],
  providers: [],
})
export class PresentModule {}
