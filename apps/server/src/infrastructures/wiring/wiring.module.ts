import { Module } from '@nestjs/common';
import { ProjectWiringModule } from '@/infrastructures/wiring/project/project-wiring.module';
import { EncryptionWiringModule } from '@/infrastructures/wiring/encryption/encryption.wiring.module';
import { GitHubApiWiringModule } from '@/infrastructures/wiring/github/github.wiring.module';
import { TechstackWiringModule } from './techstack/techstack.wiring.module';
@Module({
  imports: [
    ProjectWiringModule,
    EncryptionWiringModule,
    GitHubApiWiringModule,
    TechstackWiringModule,
  ],
  providers: [],
  exports: [
    ProjectWiringModule,
    EncryptionWiringModule,
    GitHubApiWiringModule,
    TechstackWiringModule,
  ],
})
export class WiringModule {}
