import { Module } from '@nestjs/common';
import { UserInfrastructure } from './user/infrastructure/user.infrastructure';
import { ProfileInfrastructure } from './profile/infrastructure/profile.infrastructure';

@Module({
  imports: [UserInfrastructure, ProfileInfrastructure],
})
export class ContextsModule {}
