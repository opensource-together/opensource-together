import { Express } from 'express';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Query,
  Inject,
} from '@nestjs/common';
import { BucketServicePort } from '../../port/bucket.service.port';
import { ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { BUCKET_SERVICE_PORT } from '../../port/bucket.service.port';
import { PublicAccess } from 'supertokens-nestjs';
@Controller('bucket')
export class BucketController {
  constructor(
    @Inject(BUCKET_SERVICE_PORT)
    private readonly bucketService: BucketServicePort,
  ) {}

  @PublicAccess()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file to the bucket' })
  async upload(@UploadedFile() file: Express.Multer.File) {
    const key = `${Date.now()}-${file.originalname}`;

    const result = await this.bucketService.upload(
      file.buffer,
      key,
      file.mimetype,
    );
    if (!result.success) {
      return { error: result.error };
    }
    return { url: result.value };
  }
}
