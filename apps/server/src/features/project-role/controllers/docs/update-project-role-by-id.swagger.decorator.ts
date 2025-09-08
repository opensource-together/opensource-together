import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateProjectRoleDto } from '../dto/update-project-role.dto';

export function UpdateProjectRoleByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a project role' }),
    ApiBody({
      type: UpdateProjectRoleDto,
      description:
        'Update a project role, tout les champs sont obligatoires, plus particulièrement pour les tech stacks',
    }),
    ApiResponse({
      status: 200,
      description: 'Project role updated successfully',
      example: {
        id: 'c3e87112-bf1e-47b3-b45b-b20a89c72c4c',
        projectId: 'be761cee-3f97-4400-be83-f6d18f981ce0',
        title: 'Go Developer',
        description:
          'Développeur backend responsable du développement des APIs et de la logique métier',
        isFilled: true,
        createdAt: '2025-09-05T16:20:43.597Z',
        updatedAt: '2025-09-06T09:49:06.596Z',
        techStacks: [
          {
            id: '2',
            name: 'Next.js',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
            type: 'TECH',
          },
          {
            id: '3',
            name: 'Angular',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angularjs/angularjs-original.svg',
            type: 'TECH',
          },
          {
            id: '4',
            name: 'Vue.js',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg',
            type: 'TECH',
          },
          {
            id: '7',
            name: 'Nest.js',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg',
            type: 'TECH',
          },
        ],
      },
    }),
  );
}
