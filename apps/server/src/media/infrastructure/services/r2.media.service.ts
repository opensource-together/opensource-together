import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
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
    file: Express.Multer.File,
    key: string,
    contentType: string,
  ): Promise<Result<string, string>> {
    try {
      if (!file.mimetype.startsWith('image/')) {
        return Result.fail('Only image files are allowed');
      }
      const buffer = file.buffer;
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: buffer,
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
}
