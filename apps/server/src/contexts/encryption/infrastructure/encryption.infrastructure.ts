import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ENCRYPTION_SERVICE_PORT } from '@/contexts/encryption/ports/encryption.service.port';
import { EncryptionService } from '@/contexts/encryption/infrastructure/encryption.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: ENCRYPTION_SERVICE_PORT,
      useClass: EncryptionService,
    },
  ],
  exports: [ENCRYPTION_SERVICE_PORT],
})
export class EncryptionInfrastructure {}
