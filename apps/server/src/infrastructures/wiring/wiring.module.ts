import { Module } from '@nestjs/common';
import { UserWiringModule } from '@/infrastructures/wiring/user/user-wiring.module';
import { ProjectWiringModule } from '@/infrastructures/wiring/project/project-wiring.module';
import { EncryptionWiringModule } from '@/infrastructures/wiring/encryption/encryption.wiring.module';
import { GitHubApiWiringModule } from '@/infrastructures/wiring/github/github.wiring.module';
import { TechstackWiringModule } from './techstack/techstack.wiring.module';
import { ProfileWiringModule } from './profile/profile-wiring.module';
@Module({
  imports: [
    UserWiringModule,
    ProjectWiringModule,
    EncryptionWiringModule,
    GitHubApiWiringModule,
    TechstackWiringModule,
    ProfileWiringModule,
  ],
  providers: [],
  exports: [
    UserWiringModule,
    ProjectWiringModule,
    EncryptionWiringModule,
    GitHubApiWiringModule,
    TechstackWiringModule,
    ProfileWiringModule,
  ],
})
export class WiringModule {}
