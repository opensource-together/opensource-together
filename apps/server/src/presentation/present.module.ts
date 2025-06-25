import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { TechstackModule } from './techstack/techstack.module';
import { ProfileModule } from './profile/profile.module';
import { ProjectRoleModule } from './projectRole/projectRole.module';
@Module({
  imports: [
    ProjectModule,
    HealthModule,
    ProjectRoleModule,
    UserModule,
    TechstackModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class PresentModule {}
