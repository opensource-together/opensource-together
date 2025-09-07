import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateProjectDto } from '../dto/update-project.dto';

export function UpdateProjectByIdDocs() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Update a project, if the title and description change, the github repo will be updated',
    }),
    ApiBody({
      type: UpdateProjectDto,
      description: 'Data of the project to update',
    }),
    ApiResponse({
      status: 200,
      description: 'Project updated successfully',
      example: {
        id: 'e214183d-bf0a-4818-9050-17d4905de4e8',
        ownerId: 'GCJO6PXIysuDms1Od6W8TefrigEamAeP',
        title: 'test3',
        description: 'new description',
        image: '',
        coverImages: [],
        readme: '',
        categories: [
          {
            id: '3',
            name: 'Mobile Applications',
          },
          {
            id: '5',
            name: 'Video Games',
          },
        ],
        techStacks: [
          {
            id: '2',
            name: 'Next.js',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
            type: 'TECH',
          },
          {
            id: '4',
            name: 'Vue.js',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg',
            type: 'TECH',
          },
        ],
        projectRoles: [
          {
            id: 'e07b8ddb-7df8-451d-b8fb-141975e1f2ef',
            title: 'Frontend Developer',
            description: 'Experienced React Developer',
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
            id: '679f7647-c7d2-4991-b663-fe000d060327',
            title: 'Frontend Developer',
            description: 'Junior React Developer',
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
            id: '13353136-d190-4ee0-a79e-7f41c9122f7d',
            title: 'Backend Developer',
            description: 'Junior PHP Developer',
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
        externalLinks: [
          {
            id: 'bdaf22c9-ec51-4449-b5ca-8a79f33949c2',
            type: 'github',
            url: 'https://github.com/lhourquin/test2',
          },
          {
            id: 'b3e01acd-c7e4-4815-bb04-0764ce9a64de',
            type: 'twitter',
            url: 'https://x.com/kalu',
          },
        ],
        createdAt: '2025-08-31T10:36:15.264Z',
        updatedAt: '2025-08-31T17:09:13.569Z',
      },
    }),
  );
}
