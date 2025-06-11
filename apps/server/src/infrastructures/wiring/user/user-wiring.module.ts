import { RepositoryModule } from '@/infrastructures/repositories/repository.module';
import { Module } from '@nestjs/common';
import { userApplicationContainer } from '@/application/user/user.application';
import { ENCRYPTION_SERVICE_PORT } from '@/application/encryption/ports/encryption.service.port';
import { EncryptionService } from '@/infrastructures/encryption/encryption.service';
@Module({
  imports: [RepositoryModule],
  providers: [
    ...userApplicationContainer,
    {
      provide: ENCRYPTION_SERVICE_PORT,
      useClass: EncryptionService,
    },
  ],
  exports: [...userApplicationContainer],
})
export class UserWiringModule {}
