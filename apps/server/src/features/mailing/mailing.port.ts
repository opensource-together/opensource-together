import { Result } from '@/libs/result';

export const MAILING_SERVICE_PORT = Symbol('MAILING_SERVICE_PORT');

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
