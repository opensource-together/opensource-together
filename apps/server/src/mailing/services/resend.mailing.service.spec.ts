import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ResendMailingService } from './resend.mailing.service';

const mockResend = {
  emails: {
    send: jest.fn(),
  },
};

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => mockResend),
}));

describe('ResendMailingService', () => {
  let service: ResendMailingService;
  let configService: ConfigService;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(async () => {
    logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResendMailingService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'RESEND_API_KEY':
                  return 'test-api-key';
                default:
                  return undefined;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ResendMailingService>(ResendMailingService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be configured with API key', () => {
    const spy = jest.spyOn(configService, 'get');
    expect(spy).toHaveBeenCalledWith('RESEND_API_KEY');
    expect(mockResend).toBeDefined();
  });

  it('should handle email send failure gracefully', async () => {
    mockResend.emails.send.mockRejectedValue(new Error('API Error'));

    const payload = {
      to: 'test@example.com',
      subject: 'Test Email',
      html: '<p>Test content</p>',
    };

    const result = await service.sendEmail(payload);

    expect(mockResend.emails.send).toHaveBeenCalledWith({
      from: undefined,
      to: 'test@example.com',
      subject: 'Test Email',
      html: '<p>Test content</p>',
      text: undefined,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('MAIL_SEND_FAILED');
    }

    expect(errorSpy).toHaveBeenCalledWith(
      `Failed to send mail to ${payload.to} with subject "${payload.subject}" with error: Error: API Error`,
    );
  });

  it('should handle successful email send', async () => {
    mockResend.emails.send.mockResolvedValue({ id: 'test-email-id' });

    const payload = {
      to: 'test@example.com',
      subject: 'Test Email',
      html: '<p>Test content</p>',
      text: 'Test content',
    };

    const result = await service.sendEmail(payload);

    expect(mockResend.emails.send).toHaveBeenCalledWith({
      from: undefined,
      to: 'test@example.com',
      subject: 'Test Email',
      html: '<p>Test content</p>',
      text: 'Test content',
    });

    expect(result.success).toBe(true);

    expect(logSpy).toHaveBeenCalledWith(
      `Sent mail to ${payload.to} with subject "${payload.subject}"`,
    );
  });

  it('should use custom from address when provided', async () => {
    mockResend.emails.send.mockResolvedValue({ id: 'test-email-id' });

    const payload = {
      to: 'test@example.com',
      subject: 'Test Email',
      html: '<p>Test content</p>',
      from: 'custom@example.com',
    };

    const result = await service.sendEmail(payload);

    expect(mockResend.emails.send).toHaveBeenCalledWith({
      from: 'custom@example.com',
      to: 'test@example.com',
      subject: 'Test Email',
      html: '<p>Test content</p>',
      text: undefined,
    });

    expect(result.success).toBe(true);
  });

  it('should use process.env.RESEND_FROM when no from is provided', async () => {
    const originalEnv = process.env.RESEND_FROM;

    try {
      process.env.RESEND_FROM = 'default@example.com';

      mockResend.emails.send.mockResolvedValue({ id: 'test-email-id' });

      const payload = {
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>Test content</p>',
      };

      const result = await service.sendEmail(payload);

      expect(mockResend.emails.send).toHaveBeenCalledWith({
        from: 'default@example.com',
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>Test content</p>',
        text: undefined,
      });

      expect(result.success).toBe(true);
    } finally {
      process.env.RESEND_FROM = originalEnv;
    }
  });
});
