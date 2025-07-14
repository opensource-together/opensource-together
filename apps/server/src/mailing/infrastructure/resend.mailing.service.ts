import { Injectable, Logger } from '@nestjs/common';
import { Result } from '@/libs/result';
import {
  MailingServicePort,
  SendEmailPayload,
} from '../ports/mailing.service.port';
import { Resend } from 'resend';

@Injectable()
export class ResendMailingService implements MailingServicePort {
  private readonly resend = new Resend(process.env.RESEND_API_KEY!);
  private readonly logger = new Logger(ResendMailingService.name);

  async sendEmail(payload: SendEmailPayload): Promise<Result<void, string>> {
    try {
      await this.resend.emails.send({
        from: payload.from ?? process.env.RESEND_FROM!, // ex: "noreply@opensourcetogether.dev"
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      });
      return Result.ok(undefined);
    } catch (err: any) {
      this.logger.error('Failed to send email', err);
      return Result.fail('MAIL_SEND_FAILED');
    }
  }
}
