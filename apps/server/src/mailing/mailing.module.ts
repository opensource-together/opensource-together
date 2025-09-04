import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MAILING_SERVICE } from './mailing.interface';
import { ResendMailingService } from './services/resend.mailing.service';

@Module({
  imports: [ConfigModule],
  providers: [{ provide: MAILING_SERVICE, useClass: ResendMailingService }],
  exports: [MAILING_SERVICE],
})
export class MailingModule {}
