import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function FindProjectRoleByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a project role' }),
    ApiResponse({
      status: 200,
      description: 'Project role retrieved successfully',
      example: {
        id: 'c3e87112-bf1e-47b3-b45b-b20a89c72c4c',
        projectId: 'be761cee-3f97-4400-be83-f6d18f981ce0',
        title: 'front Developer',
        description:
          'Développeur front responsable du développement des composant et de la connexion au back',
        isFilled: false,
        createdAt: '2025-09-05T16:20:43.597Z',
        updatedAt: '2025-09-06T09:58:30.015Z',
        techStacks: [
          {
            id: '4',
            name: 'Vue.js',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg',
            type: 'TECH',
          },
        ],
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Project role not found',
      example: {
        message: 'Project role not found',
      },
    }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
}
