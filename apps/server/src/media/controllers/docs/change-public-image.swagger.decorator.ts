import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function ApiChangePublicImage() {
  return applyDecorators(
    ApiOperation({ summary: 'Change a public image in R2' }),
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
    ApiParam({
      name: 'key',
      type: String,
      description: 'The key of the image to replace',
      required: true,
    }),
    ApiResponse({
      status: 200,
      description: 'The URL of the new image with its key',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                example:
                  'https://pub-9015c9fc95574da98f6e7b9d4555ae24.r2.dev/images/2024/01/15/123e4567-e89b-12d3-a456-426614174000.jpg',
                description: 'Public URL of the new image',
              },
              key: {
                type: 'string',
                example:
                  'images/2024/01/15/123e4567-e89b-12d3-a456-426614174000.jpg',
                description: 'Unique key of the new image',
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
        'Validation error (file missing, key missing, unsupported type, size exceeded)',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Missing key',
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
