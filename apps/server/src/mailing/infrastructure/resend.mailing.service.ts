import { Injectable, Logger } from '@nestjs/common';
import { Result } from '@/libs/result';
import {
  MailingServicePort,
  SendEmailPayload,
} from '../ports/mailing.service.port';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResendMailingService implements MailingServicePort {
  private readonly resend: Resend;
  private readonly logger = new Logger(ResendMailingService.name);
  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  async sendEmail(payload: SendEmailPayload): Promise<Result<void, string>> {
    try {
      const resendResponse = await this.resend.emails.send({
        from: payload.from ?? process.env.RESEND_FROM!, // ex: "noreply@opensourcetogether.dev"
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      });
      this.logger.log(`Sent mail to ${payload.to} with subject "${payload.subject}"`);
      return Result.ok(undefined);
    } catch (err: any) {
      this.logger.error(`Failed to send mail to ${payload.to} with subject "${payload.subject}"`);
      return Result.fail('MAIL_SEND_FAILED');
    }
  }
}
