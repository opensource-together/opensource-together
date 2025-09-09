import { applyDecorators } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function DeleteProfileDocs() {
  return applyDecorators(
    ApiCookieAuth('sAccessToken'),
    ApiOperation({
      summary: 'Delete the profile of the currently authenticated user',
    }),
    ApiResponse({ status: 204, description: 'Profile deleted successfully' }),
    ApiResponse({ status: 404, description: 'Profile not found' }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
}
