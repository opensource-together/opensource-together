import { applyDecorators } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function DeleteProjectByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a project' }),
    ApiCookieAuth('sAccessToken'),
    ApiResponse({ status: 204, description: 'Project deleted successfully' }),
    ApiResponse({
      status: 404,
      description: 'Project not found',
      example: { message: 'Project not found' },
    }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
}
