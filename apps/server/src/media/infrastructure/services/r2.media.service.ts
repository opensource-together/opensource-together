import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  NotFound,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { MediaServicePort } from '../../port/media.service.port';
import { Result } from '@/libs/result';

@Injectable()
export class R2MediaService implements MediaServicePort {
  private s3: S3Client;
  private bucket: string;
  private url: string;

  constructor(private configService: ConfigService) {
    this.bucket = this.configService.get('R2_BUCKET_NAME') as string;
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: this.configService.get('R2_ENDPOINT') as string,
      credentials: {
        accessKeyId: this.configService.get('R2_ACCESS_KEY_ID') as string,
        secretAccessKey: this.configService.get(
          'R2_SECRET_ACCESS_KEY',
        ) as string,
      },
    });
    this.url = this.configService.get('R2_URL') as string;
  }

  async uploadPublicImage(
    image: Buffer,
    key: string,
    contentType: string,
  ): Promise<Result<string, string>> {
    try {
      if (!contentType.startsWith('image/')) {
        return Result.fail('Only image files are allowed');
      }
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: image,
          ContentType: contentType,
          ACL: 'public-read',
        }),
      );
      const imageUrl = `${this.url}/${key}`;
      return Result.ok(imageUrl);
    } catch (error) {
      console.error(error);
      return Result.fail('Failed to upload media');
    }
  }

  async delete(key: string): Promise<Result<string, string>> {
    try {
      const existsBeforeDelete = await this.exists(key);
      if (!existsBeforeDelete) {
        return Result.fail("Image doesn't exist");
      }
      const result = await this.s3.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      if (result.$metadata.httpStatusCode === 204) {
        const existsAfterDelete = await this.exists(key);
        if (existsAfterDelete) {
          return Result.fail('Failed to delete media');
        }
        return Result.ok('Image deleted successfully');
      }
      return Result.fail('Failed to delete media');
    } catch (error) {
      console.error(error);
      return Result.fail('Failed to delete media');
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.s3.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      if (result.$metadata.httpStatusCode !== 200) {
        return false;
      }
      return true;
    } catch (error) {
      if (error instanceof NotFound) return false;
      throw error;
    }
  }
}
