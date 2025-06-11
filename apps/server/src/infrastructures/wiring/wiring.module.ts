import { Module } from '@nestjs/common';
import { UserWiringModule } from '@/infrastructures/wiring/user/user-wiring.module';
import { ProjectWiringModule } from '@/infrastructures/wiring/project/project-wiring.module';
import { EncryptionWiringModule } from '@/infrastructures/wiring/encryption/encryption.wiring.module';
import { GitHubApiWiringModule } from '@/infrastructures/wiring/github/github.wiring.module';
@Module({
  imports: [
    UserWiringModule,
    ProjectWiringModule,
    EncryptionWiringModule,
    GitHubApiWiringModule,
  ],
  providers: [],
  exports: [
    UserWiringModule,
    ProjectWiringModule,
    EncryptionWiringModule,
    GitHubApiWiringModule,
  ],
})
export class WiringModule {}
