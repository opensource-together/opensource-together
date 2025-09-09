import { applyDecorators } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function GetGithubRepositoryDocs() {
  return applyDecorators(
    ApiOperation({
      summary: "Fetch the current user's github repository list",
    }),
    ApiCookieAuth('sAccessToken'),
    ApiResponse({
      status: 200,
      description: "List of current user's repositories",
      example: {
        repositories: [
          {
            owner: 'JohnDoe',
            title: 'SampleProject',
            description: 'A Sample project',
            url: 'https://github.com/JohnDoe/SampleProject',
          },
        ],
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing authentication',
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
      example: {
        message: 'User not found',
        error: 'Not Found',
        statusCode: 404,
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    }),
  );
}
