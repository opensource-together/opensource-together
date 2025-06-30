import { Module } from '@nestjs/common';
import { EncryptionWiringModule } from '@/infrastructures/wiring/encryption/encryption.wiring.module';
import { GitHubApiWiringModule } from '@/infrastructures/wiring/github/github.wiring.module';
import { TechstackWiringModule } from './techstack/techstack.wiring.module';
@Module({
  imports: [
    EncryptionWiringModule,
    GitHubApiWiringModule,
    TechstackWiringModule,
  ],
  providers: [],
  exports: [
    EncryptionWiringModule,
    GitHubApiWiringModule,
    TechstackWiringModule,
  ],
})
export class WiringModule {}
