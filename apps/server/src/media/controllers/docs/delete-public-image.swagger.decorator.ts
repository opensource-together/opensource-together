import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function ApiDeletePublicImage() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a public image from R2' }),
    ApiParam({
      name: 'key',
      type: String,
      description: 'The key of the image to delete',
      required: true,
    }),
    ApiResponse({
      status: 200,
      description: 'Image deleted successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Image deleted successfully',
                description: 'Confirmation message',
              },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Validation error (key missing)',
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
      description: 'Error deleting image',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Failed to delete media' },
            },
          },
        },
      },
    }),
  );
}
