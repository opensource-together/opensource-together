import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function DeleteProjectByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a project' }),
    ApiResponse({
      status: 200,
      description: 'Project deleted successfully',
      example: { message: 'Project deleted successfully' },
    }),
  );
}
