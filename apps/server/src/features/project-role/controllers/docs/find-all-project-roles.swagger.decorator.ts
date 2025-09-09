import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function FindAllProjectRolesDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all project roles' }),
    ApiResponse({
      status: 200,
      description: 'Project roles retrieved successfully',
      example: [
        {
          id: 'b0f82f52-a673-4615-bd7b-23615c5b7860',
          projectId: 'be761cee-3f97-4400-be83-f6d18f981ce0',
          title: 'Frontend Developer',
          description: 'Développeur React expérimenté',
          isFilled: false,
          techStacks: [
            {
              id: '2',
              name: 'Next.js',
              iconUrl:
                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
              type: 'TECH',
            },
          ],
        },
        {
          id: 'aa10d1b5-1e02-439f-ae28-bf2f620c3b61',
          projectId: 'be761cee-3f97-4400-be83-f6d18f981ce0',
          title: 'Frontend Developer',
          description: 'Développeur React junior',
          isFilled: false,
          techStacks: [
            {
              id: '2',
              name: 'Next.js',
              iconUrl:
                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
              type: 'TECH',
            },
          ],
        },
      ],
    }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
}
