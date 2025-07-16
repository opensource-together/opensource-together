import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { BucketServicePort } from '../../port/bucket.service.port';
import { Result } from '@/libs/result';

@Injectable()
export class BucketR2Service implements BucketServicePort {
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

  async upload(
    buffer: Buffer,
    key: string,
    contentType: string,
  ): Promise<Result<string, string>> {
    try {
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
      console.log({ imageUrl });
      return Result.ok(imageUrl);
    } catch (error) {
      console.error(error);
      return Result.fail(error as string);
    }
  }
}
