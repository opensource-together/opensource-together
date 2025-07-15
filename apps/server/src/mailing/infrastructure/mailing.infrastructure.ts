import { Global, Module } from '@nestjs/common';
import { ResendMailingService } from './resend.mailing.service';
import { MAILING_SERVICE_PORT } from '../ports/mailing.service.port';

@Global() // module global pour injection partout
@Module({
  providers: [
    {
      provide: MAILING_SERVICE_PORT,
      useClass: ResendMailingService,
    },
  ],
  exports: [MAILING_SERVICE_PORT],
})
export class MailingModule {}
