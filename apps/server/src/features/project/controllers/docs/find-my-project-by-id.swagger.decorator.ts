import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function FindMyProjectByIdDocs() {
  return applyDecorators(
    ApiCookieAuth('sAccessToken'),
    ApiOperation({
      summary: 'Get my project by ID',
      description:
        'Retrieve a specific project owned by the currently authenticated user',
    }),
    ApiParam({
      name: 'id',
      description: 'Project ID',
      type: 'string',
      example: '16bc4345-953a-487f-8824-08c5e93dbb1e',
    }),
    ApiResponse({
      status: 200,
      description: 'Successfully retrieved user project',
      example: {
        id: '16bc4345-953a-487f-8824-08c5e93dbb1e',
        owner: {
          id: 'GCJO6PXIysuDms1Od6W8TefrigEamAeP',
          name: 'Owner Name',
          githubLogin: 'owner-gh',
          image: 'https://avatars.githubusercontent.com/u/45101981?v=4',
        },
        title: 'My OSS Project',
        description: 'A modern open-source project',
        image: '',
        coverImages: [],
        readme: '# README',
        categories: [
          { id: '3', name: 'Mobile Applications' },
          { id: '5', name: 'Video Games' },
        ],
        techStacks: [
          {
            id: '2',
            name: 'Next.js',
            iconUrl:
              'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
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
        ],
        externalLinks: [
          {
            id: 'bdaf22c9-ec51-4449-b5ca-8a79f33949c2',
            type: 'github',
            url: 'https://github.com/org/repo',
          },
        ],
        createdAt: '2025-08-31T10:36:15.264Z',
        updatedAt: '2025-08-31T17:09:13.569Z',
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Project does not belong to user',
    }),
    ApiResponse({
      status: 404,
      description: 'Project not found',
    }),
  );
}
