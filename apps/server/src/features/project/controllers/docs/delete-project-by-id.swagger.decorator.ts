import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function DeleteProjectByIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete project by ID',
      description:
        'Permanently deletes a project and all its associated data including roles, external links, and GitHub repository. This action cannot be undone.',
    }),
    ApiParam({
      name: 'id',
      description: 'Unique identifier of the project to delete',
      type: 'string',
      format: 'uuid',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiCookieAuth('sAccessToken'),
    ApiResponse({
      status: 204,
      description: 'Project deleted successfully',
      example: null,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Authentication required',
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Project does not belong to user',
      example: {
        message: 'You do not have permission to delete this project',
        statusCode: 403,
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Project not found',
      example: {
        message: 'Project not found',
        statusCode: 404,
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
      example: {
        message: 'Internal server error',
        statusCode: 500,
      },
    }),
  );
}
