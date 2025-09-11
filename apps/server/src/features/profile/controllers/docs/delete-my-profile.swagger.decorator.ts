import { applyDecorators } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function DeleteProfileDocs() {
  return applyDecorators(
    ApiCookieAuth('sAccessToken'),
    ApiOperation({
      summary: 'Delete the profile of the currently authenticated user',
      description:
        'Permanently deletes the profile of the currently authenticated user. This action cannot be undone and will remove all profile data including bio, job title, tech stacks, and social links.',
    }),
    ApiResponse({
      status: 200,
      description: 'Profile deleted successfully',
      example: {
        message: 'Profile deleted successfully',
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Profile not found',
      example: {
        statusCode: 404,
        message: 'Profile not found',
        error: 'Not Found',
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing authentication',
      example: { statusCode: 401, message: 'Unauthorized' },
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
      example: { statusCode: 500, message: 'Internal server error' },
    }),
  );
}
