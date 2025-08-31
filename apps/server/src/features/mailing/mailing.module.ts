import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MAILING_SERVICE_PORT } from './mailing.port';
import { ResendMailingService } from './services/resend.mailing.service';

@Module({
  imports: [ConfigModule],
  providers: [
    ResendMailingService,
    { provide: MAILING_SERVICE_PORT, useClass: ResendMailingService },
  ],
  exports: [MAILING_SERVICE_PORT],
})
export class MailingModule {}
