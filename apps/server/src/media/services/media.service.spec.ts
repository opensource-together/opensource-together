import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from './media.service';

interface MediaServiceTestAccess {
  bucket: string;
  publicBaseUrl: string;
  buildPublicUrl: (key: string) => string;
  s3: {
    send: jest.Mock;
  };
}

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),

  PutObjectCommand: jest
    .fn()
    .mockImplementation((input: Record<string, unknown>) => ({ input })),

  DeleteObjectCommand: jest
    .fn()
    .mockImplementation((input: Record<string, unknown>) => ({ input })),
}));

const mockEnv = {
  R2_BUCKET_NAME: 'test-bucket',
  R2_ENDPOINT: 'https://test-endpoint.com',
  R2_ACCESS_KEY_ID: 'test-access-key',
  R2_SECRET_ACCESS_KEY: 'test-secret-key',
  R2_URL: 'https://test-url.com',
};

describe('MediaService', () => {
  let service: MediaService;
  let serviceAccess: MediaServiceTestAccess;
  let mockS3Send: jest.Mock;

  beforeEach(async () => {
    Object.assign(process.env, mockEnv);

    const module: TestingModule = await Test.createTestingModule({
      providers: [MediaService],
    }).compile();

    service = module.get<MediaService>(MediaService);
    serviceAccess = service as unknown as MediaServiceTestAccess;

    mockS3Send = serviceAccess.s3.send;

    jest.spyOn(Logger.prototype, 'error').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    Object.keys(mockEnv).forEach((key) => {
      delete process.env[key];
    });
  });

  describe('constructor', () => {
    it('should set bucket name from environment', () => {
      expect(serviceAccess.bucket).toBe(mockEnv.R2_BUCKET_NAME);
    });

    it('should set public base URL from environment', () => {
      expect(serviceAccess.publicBaseUrl).toBe(mockEnv.R2_URL);
    });
  });

  describe('buildPublicUrl', () => {
    it('should build correct public URL for simple key', () => {
      const key = 'test-image.jpg';
      const result = serviceAccess.buildPublicUrl(key);
      expect(result).toBe(`${mockEnv.R2_URL}/${key}`);
    });

    it('should encode special characters in key', () => {
      const key = 'test folder/image with spaces.jpg';
      const result = serviceAccess.buildPublicUrl(key);
      expect(result).toBe(
        `${mockEnv.R2_URL}/test%20folder/image%20with%20spaces.jpg`,
      );
    });

    it('should handle nested paths correctly', () => {
      const key = 'images/2024/01/15/test-image.jpg';
      const result = serviceAccess.buildPublicUrl(key);
      expect(result).toBe(`${mockEnv.R2_URL}/images/2024/01/15/test-image.jpg`);
    });
  });

  describe('uploadPublicImage', () => {
    const mockImageBuffer = Buffer.from('fake-image-data');
    const mockKey = 'test-key.jpg';
    const mockContentType = 'image/jpeg';

    it('should successfully upload image', async () => {
      mockS3Send.mockResolvedValueOnce({});

      const result = await service.uploadPublicImage(
        mockImageBuffer,
        mockKey,
        mockContentType,
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(`${mockEnv.R2_URL}/${mockKey}`);
      }
      expect(mockS3Send).toHaveBeenCalledTimes(1);
    });

    it('should reject files without proper content type', async () => {
      const result = await service.uploadPublicImage(mockImageBuffer, mockKey);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Only image files are allowed');
      }
      expect(mockS3Send).not.toHaveBeenCalled();
    });

    it('should reject non-image content types', async () => {
      const result = await service.uploadPublicImage(
        mockImageBuffer,
        mockKey,
        'text/plain',
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Only image files are allowed');
      }
      expect(mockS3Send).not.toHaveBeenCalled();
    });

    it('should handle S3 upload errors', async () => {
      const s3Error = new Error('S3 upload failed');
      mockS3Send.mockRejectedValueOnce(s3Error);

      const result = await service.uploadPublicImage(
        mockImageBuffer,
        mockKey,
        mockContentType,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Failed to upload media');
      }
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(Logger.prototype.error).toHaveBeenCalled();
    });

    it('should accept various image content types', async () => {
      const imageTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/avif',
      ];

      for (const contentType of imageTypes) {
        mockS3Send.mockResolvedValueOnce({});

        const result = await service.uploadPublicImage(
          mockImageBuffer,
          mockKey,
          contentType,
        );

        expect(result.success).toBe(true);
      }
    });
  });

  describe('delete', () => {
    const mockKey = 'test-key.jpg';

    it('should successfully delete image', async () => {
      mockS3Send.mockResolvedValueOnce({});

      const result = await service.delete(mockKey);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe('Image deleted successfully');
      }
      expect(mockS3Send).toHaveBeenCalledTimes(1);
    });

    it('should handle S3 delete errors', async () => {
      const s3Error = new Error('S3 delete failed');
      mockS3Send.mockRejectedValueOnce(s3Error);

      const result = await service.delete(mockKey);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Failed to delete media');
      }
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(Logger.prototype.error).toHaveBeenCalled();
    });
  });

  describe('changePublicImage', () => {
    const mockImageBuffer = Buffer.from('fake-image-data');
    const mockOldKey = 'old-key.jpg';
    const mockNewKey = 'new-key.jpg';
    const mockContentType = 'image/jpeg';

    it('should successfully change image', async () => {
      const mockNewUrl = `${mockEnv.R2_URL}/${mockNewKey}`;

      mockS3Send
        .mockResolvedValueOnce({}) // upload
        .mockResolvedValueOnce({}); // delete

      const result = await service.changePublicImage(
        mockOldKey,
        mockNewKey,
        mockImageBuffer,
        mockContentType,
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(mockNewUrl);
      }
      expect(mockS3Send).toHaveBeenCalledTimes(2);
    });

    it('should handle upload failure in change operation', async () => {
      const uploadError = new Error('Upload failed');
      mockS3Send.mockRejectedValueOnce(uploadError);

      const result = await service.changePublicImage(
        mockOldKey,
        mockNewKey,
        mockImageBuffer,
        mockContentType,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Failed to upload media');
      }
      expect(mockS3Send).toHaveBeenCalledTimes(1);
    });

    it('should warn but continue if old image deletion fails', async () => {
      const mockNewUrl = `${mockEnv.R2_URL}/${mockNewKey}`;

      mockS3Send
        .mockResolvedValueOnce({}) // upload succeeds
        .mockRejectedValueOnce(new Error('Delete failed')); // delete fails

      const result = await service.changePublicImage(
        mockOldKey,
        mockNewKey,
        mockImageBuffer,
        mockContentType,
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(mockNewUrl);
      }
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(Logger.prototype.warn).toHaveBeenCalled();
    });

    it('should handle unexpected errors', async () => {
      const unexpectedError = new Error('Unexpected error');

      jest
        .spyOn(service, 'uploadPublicImage')
        .mockRejectedValueOnce(unexpectedError);

      const result = await service.changePublicImage(
        mockOldKey,
        mockNewKey,
        mockImageBuffer,
        mockContentType,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Failed to change media');
      }
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(Logger.prototype.error).toHaveBeenCalled();
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete image lifecycle', async () => {
      const mockImageBuffer = Buffer.from('fake-image-data');
      const mockKey = 'test-key.jpg';
      const mockContentType = 'image/jpeg';

      // Upload
      mockS3Send.mockResolvedValueOnce({});
      const uploadResult = await service.uploadPublicImage(
        mockImageBuffer,
        mockKey,
        mockContentType,
      );
      expect(uploadResult.success).toBe(true);

      // Delete
      mockS3Send.mockResolvedValueOnce({});
      const deleteResult = await service.delete(mockKey);
      expect(deleteResult.success).toBe(true);

      expect(mockS3Send).toHaveBeenCalledTimes(2);
    });

    it('should handle change operation with proper cleanup', async () => {
      const mockImageBuffer = Buffer.from('fake-image-data');
      const mockOldKey = 'old-key.jpg';
      const mockNewKey = 'new-key.jpg';
      const mockContentType = 'image/jpeg';

      mockS3Send
        .mockResolvedValueOnce({}) // upload new
        .mockResolvedValueOnce({}); // delete old

      const result = await service.changePublicImage(
        mockOldKey,
        mockNewKey,
        mockImageBuffer,
        mockContentType,
      );

      expect(result.success).toBe(true);
      expect(mockS3Send).toHaveBeenCalledTimes(2);
    });
  });
});
