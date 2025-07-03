import { Module } from '@nestjs/common';
import { UserInfrastructure } from './user/infrastructure/user.infrastructure';
import { ProjectInfrastructure } from './project/infrastructure/project.infrastructure';
import { ProfileInfrastructure } from './profile/infrastructure/profile.infrastructure';
import { TechStackInfrastructure } from './techstack/infrastructure/techstack.infrastructure';

@Module({
  imports: [
    UserInfrastructure,
    ProjectInfrastructure,
    ProfileInfrastructure,
    TechStackInfrastructure,
  ],
  exports: [
    UserInfrastructure,
    ProjectInfrastructure,
    ProfileInfrastructure,
    TechStackInfrastructure,
  ],
})
export class ContextsModule {}
