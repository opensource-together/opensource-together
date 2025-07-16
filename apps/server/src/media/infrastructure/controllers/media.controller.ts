import { Express } from 'express';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Inject,
} from '@nestjs/common';
import { MediaServicePort } from '../../port/media.service.port';
import { ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { MEDIA_SERVICE_PORT } from '../../port/media.service.port';
import { PublicAccess } from 'supertokens-nestjs';
@Controller('media')
export class MediaController {
  constructor(
    @Inject(MEDIA_SERVICE_PORT)
    private readonly mediaService: MediaServicePort,
  ) {}

  @PublicAccess()
  @Post('upload/image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file to the bucket' })
  async upload(@UploadedFile() file: Express.Multer.File) {
    const key = `${Date.now()}-${file.originalname}`;

    const result = await this.mediaService.upload(
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
