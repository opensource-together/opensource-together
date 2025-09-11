import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function DeleteProjectRoleByIdDocs() {
  return applyDecorators(
    ApiCookieAuth('sAccessToken'),
    ApiOperation({
      summary: 'Delete project role by ID',
      description:
        'Permanently deletes a project role and all its associated data. This action cannot be undone.',
    }),
    ApiParam({
      name: 'projectId',
      description: 'Unique identifier of the project',
      type: 'string',
      format: 'uuid',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiParam({
      name: 'roleId',
      description: 'Unique identifier of the project role to delete',
      type: 'string',
      format: 'uuid',
      example: 'b7130a7c-09b4-46dd-8f5d-043938cf40b9',
    }),
    ApiResponse({
      status: 204,
      description: 'Project role deleted successfully',
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
        message: 'You do not have permission to delete this project role',
        statusCode: 403,
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Project role not found',
      example: {
        message: 'Project role not found',
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
