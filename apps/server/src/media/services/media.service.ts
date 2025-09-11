import { Result } from '@/libs/result';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MediaService {
  private s3: S3Client;
  private bucket: string;
  private readonly publicBaseUrl: string;
  private readonly Logger = new Logger(MediaService.name);

  constructor() {
    this.bucket = process.env.R2_BUCKET_NAME!;
    this.publicBaseUrl = process.env.R2_URL!;
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }

  private buildPublicUrl(key: string): string {
    const safeKey = key.split('/').map(encodeURIComponent).join('/');
    return `${this.publicBaseUrl}/${safeKey}`;
  }

  async uploadPublicImage(
    image: Buffer,
    key: string,
    contentType?: string,
  ): Promise<Result<string, string>> {
    try {
      const mime = contentType ?? 'application/octet-stream';
      if (!/^image\//.test(mime)) {
        return Result.fail('Only image files are allowed');
      }
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: image,
          ContentType: mime,
          CacheControl: 'public, max-age=31536000, immutable',
        }),
      );

      return Result.ok(this.buildPublicUrl(key));
    } catch (err) {
      this.Logger.error(`uploadPublicImage failed for key="${key}"`, err);
      return Result.fail('Failed to upload media');
    }
  }

  async changePublicImage(
    oldKey: string,
    newKey: string,
    image: Buffer,
    contentType?: string,
  ): Promise<Result<string, string>> {
    try {
      const uploaded = await this.uploadPublicImage(image, newKey, contentType);
      if (!uploaded.success) return uploaded;

      const del = await this.delete(oldKey);
      if (!del.success) {
        this.Logger.warn(
          `Old image not deleted after changePublicImage. oldKey="${oldKey}"`,
        );
      }

      return Result.ok(uploaded.value);
    } catch (err) {
      this.Logger.error(
        `changePublicImage failed oldKey="${oldKey}" newKey="${newKey}"`,
        err,
      );
      return Result.fail('Failed to change media');
    }
  }

  async delete(key: string): Promise<Result<string, string>> {
    try {
      await this.s3.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      return Result.ok('Image deleted successfully');
    } catch (err) {
      this.Logger.error(`delete failed for key="${key}"`, err);
      return Result.fail('Failed to delete media');
    }
  }
}
