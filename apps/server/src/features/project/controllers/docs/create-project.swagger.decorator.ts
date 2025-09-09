import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateProjectDto } from '../dto/create-project.dto';

export function CreateProjectDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a project' }),
    ApiCookieAuth('sAccessToken'),
    ApiBody({
      type: CreateProjectDto,
      description: 'Data of the project to create',
      examples: {
        default: {
          summary: 'Minimal valid payload',
          value: {
            title: 'My OSS Project',
            description: 'A modern open-source project',
            categories: ['1', '4'],
            techStacks: ['3', '7'],
            projectRoles: [
              {
                title: 'Frontend Developer',
                description: 'Build UI with React',
                techStacks: ['react', 'typescript'],
              },
            ],
            image: 'https://example.com/image.png',
            teamMembers: [{ userId: 'user-1', role: 'Maintainer' }],
            coverImages: ['https://example.com/cover-1.png'],
            readme: '# Project README',
            externalLinks: [
              { type: 'github', url: 'https://github.com/org/repo' },
              { type: 'website', url: 'https://example.com' },
            ],
          },
        },
      },
    }),
    ApiResponse({ status: 201, description: 'Project created successfully' }),
    ApiResponse({
      status: 400,
      description: 'Bad request',
      example: { message: 'Bad request' },
    }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
}
