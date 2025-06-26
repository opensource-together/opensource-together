import { Module } from '@nestjs/common';
import { ProjectWiringModule } from '@/infrastructures/wiring/project/project-wiring.module';
import { EncryptionWiringModule } from '@/infrastructures/wiring/encryption/encryption.wiring.module';
import { GitHubApiWiringModule } from '@/infrastructures/wiring/github/github.wiring.module';
import { TechstackWiringModule } from './techstack/techstack.wiring.module';
import { ProfileWiringModule } from './profile/profile-wiring.module';
@Module({
  imports: [
    ProjectWiringModule,
    EncryptionWiringModule,
    GitHubApiWiringModule,
    TechstackWiringModule,
    ProfileWiringModule,
  ],
  providers: [],
  exports: [
    ProjectWiringModule,
    EncryptionWiringModule,
    GitHubApiWiringModule,
    TechstackWiringModule,
    ProfileWiringModule,
  ],
})
export class WiringModule {}
