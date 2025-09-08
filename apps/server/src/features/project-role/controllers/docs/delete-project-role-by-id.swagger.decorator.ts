import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function DeleteProjectRoleByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a project role' }),
    ApiResponse({
      status: 204,
      description: 'Project role deleted successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'Project role not found',
      example: {
        message: 'Project role not found',
      },
    }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
}
