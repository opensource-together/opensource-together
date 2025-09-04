import { Result } from '@/libs/result';

export const MAILING_SERVICE = Symbol('MAILING_SERVICE');

export interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface MailingServicePort {
  sendEmail(payload: SendEmailPayload): Promise<Result<void, string>>;
}
