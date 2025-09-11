import {
  Controller,
  Delete,
  FileTypeValidator,
  HttpException,
  HttpStatus,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { randomUUID } from 'crypto';
import { MediaService } from '../services/media.service';
import { ApiChangePublicImage } from './docs/change-public-image.swagger.decorator';
import { ApiDeletePublicImage } from './docs/delete-public-image.swagger.decorator';
import { ApiUploadPublicImage } from './docs/upload-public-image.swagger.decorator';

function buildObjectKey(originalname: string) {
  const ext = (originalname?.split('.').pop() || 'bin').toLowerCase();
  const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'].includes(ext)
    ? ext
    : 'bin';
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `images/${yyyy}/${mm}/${dd}/${randomUUID()}.${safeExt}`;
}

@Controller('media')
export class MediaController {
  constructor(
    @Inject(MediaService) private readonly mediaService: MediaService,
  ) {}

  @Post('image/public')
  @UseInterceptors(FileInterceptor('image'))
  @ApiUploadPublicImage()
  async uploadPublicImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({
            fileType: /^(image\/)(jpeg|png|webp|avif|gif)$/,
          }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    if (!image) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }
    const key = buildObjectKey(image.originalname);
    const result = await this.mediaService.uploadPublicImage(
      image.buffer,
      key,
      image.mimetype,
    );
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return { url: result.value, key };
  }

  @Put('image/public/:key')
  @UseInterceptors(FileInterceptor('image'))
  @ApiChangePublicImage()
  async changePublicImage(
    @Param('key') oldKey: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({
            fileType: /^(image\/)(jpeg|png|webp|avif|gif)$/,
          }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    if (!oldKey) {
      throw new HttpException('Missing oldKey', HttpStatus.BAD_REQUEST);
    }
    if (!image) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }
    const newKey = buildObjectKey(image.originalname);
    const result = await this.mediaService.changePublicImage(
      oldKey,
      newKey,
      image.buffer,
      image.mimetype,
    );
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return { url: result.value, key: newKey };
  }

  @Delete('image/public/:key')
  @ApiDeletePublicImage()
  async deletePublicImage(@Param('key') key: string) {
    if (!key) {
      throw new HttpException('Missing key', HttpStatus.BAD_REQUEST);
    }
    const result = await this.mediaService.delete(key);
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return { message: 'Image deleted successfully' };
  }
}
