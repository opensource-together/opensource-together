import { Result } from '@/libs/result';

export const MAILING_SERVICE_PORT = Symbol('MailingService');

export interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string; // défaut défini dans .env
}

export interface MailingServicePort {
  sendEmail(payload: SendEmailPayload): Promise<Result<void, string>>;
}
