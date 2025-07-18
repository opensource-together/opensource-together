import { Express } from 'express';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Inject,
  HttpException,
  HttpStatus,
  Delete,
  Param,
} from '@nestjs/common';
import { MediaServicePort } from '../../port/media.service.port';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { MEDIA_SERVICE_PORT } from '../../port/media.service.port';
@Controller('media')
export class MediaController {
  constructor(
    @Inject(MEDIA_SERVICE_PORT)
    private readonly mediaService: MediaServicePort,
  ) {}

  @Post('upload/image/public')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Uploader une image publique vers R2' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Fichier image à uploader (jpg, png, etc.)',
        },
      },
      required: ['image'],
    },
  })
  @ApiResponse({
    status: 200,
    description: "L'URL de l'image uploadée",
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              example:
                'https://pub-9015c9fc95574da98f6e7b9d4555ae24.r2.dev/1752701599288-policier-lol.jpg',
              description: "URL publique de l'image uploadée",
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Erreur lors de l'upload de l'image",
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Only image files are allowed' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Erreur lors de l'upload de l'image",
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Failed to upload media' },
          },
        },
      },
    },
  })
  async uploadPublicImage(@UploadedFile() image: Express.Multer.File) {
    const key = `${Date.now()}-${image.originalname}`;
    const result = await this.mediaService.uploadPublicImage(
      image.buffer,
      key,
      image.mimetype,
    );
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return { url: result.value };
  }

  @Delete('delete/image/public/:key')
  async deletePublicImage(@Param('key') key: string) {
    const result = await this.mediaService.delete(key);
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return { message: 'Image deleted successfully' };
  }
}
