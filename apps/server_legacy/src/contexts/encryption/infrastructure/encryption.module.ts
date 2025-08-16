import { Module } from '@nestjs/common';
import { EncryptionService } from './encryption.service';
import { ENCRYPTION_SERVICE_PORT } from '../ports/encryption.service.port';

@Module({
  providers: [
    {
      provide: ENCRYPTION_SERVICE_PORT,
      useClass: EncryptionService,
    },
  ],
  exports: [ENCRYPTION_SERVICE_PORT],
})
export class EncryptionModule {}
