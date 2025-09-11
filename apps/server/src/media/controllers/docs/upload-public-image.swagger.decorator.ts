import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export function ApiUploadPublicImage() {
  return applyDecorators(
    ApiOperation({ summary: 'Upload a public image to R2' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          image: {
            type: 'string',
            format: 'binary',
            description: 'Image file to upload (jpg, png, etc.)',
          },
        },
        required: ['image'],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'The URL of the uploaded image with its key',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                example:
                  'https://pub-9015c9fc95574da98f6e7b9d4555ae24.r2.dev/images/2024/01/15/123e4567-e89b-12d3-a456-426614174000.jpg',
                description: 'Public URL of the uploaded image',
              },
              key: {
                type: 'string',
                example:
                  'images/2024/01/15/123e4567-e89b-12d3-a456-426614174000.jpg',
                description: 'Unique key of the image for future operations',
              },
            },
            required: ['url', 'key'],
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description:
        'Error validation (file missing, unsupported type, size exceeded)',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'No file provided',
                description: 'Validation error message',
              },
              error: {
                type: 'string',
                example: 'Bad Request',
                description: 'Error type',
              },
              statusCode: {
                type: 'number',
                example: 400,
                description: 'HTTP status code',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Error uploading image',
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
    }),
  );
}
