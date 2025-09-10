import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function FindAllProjectsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all projects',
      description:
        'Retrieves a paginated list of all public projects with their basic information, statistics, and team members. Projects are ordered by creation date (newest first).',
    }),
    ApiResponse({
      status: 200,
      description: 'Successfully retrieved list of projects',
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          owner: {
            id: 'NLxTW4lMvMJSbEvpIShgtckD15cnbFVH',
            username: 'y2_znt',
            avatarUrl: 'https://avatars.githubusercontent.com/u/152095147?v=4',
          },
          title: 'E-commerce Platform',
          description:
            'Modern e-commerce application built with React, Node.js, and TypeScript. Features include real-time inventory management, payment processing, and responsive design.',
          image: 'https://example.com/project-image.jpg',
          techStacks: [
            {
              id: '3',
              name: 'React',
              iconUrl:
                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
              type: 'TECH',
            },
            {
              id: '7',
              name: 'Node.js',
              iconUrl:
                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
              type: 'TECH',
            },
            {
              id: '9',
              name: 'TypeScript',
              iconUrl:
                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
              type: 'LANGUAGE',
            },
          ],
          teamMembers: [
            {
              id: 'member1',
              projectId: '123e4567-e89b-12d3-a456-426614174000',
              userId: 'NLxTW4lMvMJSbEvpIShgtckD15cnbFVH',
              joinedAt: '2025-01-15T10:30:00.000Z',
            },
            {
              id: 'member2',
              projectId: '123e4567-e89b-12d3-a456-426614174000',
              userId: 'github_user456',
              joinedAt: '2025-01-16T14:20:00.000Z',
            },
          ],
          stats: {
            stats: {
              forks: 15,
              stars: 42,
              watchers: 8,
              openIssues: 3,
            },
            contributors: [
              {
                login: 'y2_znt',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/152095147?v=4',
                html_url: 'https://github.com/y2_znt',
                contributions: 25,
              },
              {
                login: 'contributor2',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/123254210?v=4',
                html_url: 'https://github.com/contributor2',
                contributions: 12,
              },
            ],
            commits: {
              lastCommit: {
                sha: '4f017368bdc6fe9ca8f4bac1b497e01d25562b6e',
                message: 'feat: Add payment integration with Stripe',
                date: '2025-01-20T14:30:00Z',
                url: 'https://github.com/y2_znt/ecommerce-platform/commit/4f017368bdc6fe9ca8f4bac1b497e01d25562b6e',
                author: {
                  login: 'y2_znt',
                  avatar_url:
                    'https://avatars.githubusercontent.com/u/152095147?v=4',
                  html_url: 'https://github.com/y2_znt',
                },
              },
              commitsNumber: 47,
            },
          },
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-20T14:45:00.000Z',
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          owner: {
            id: 'github_user456',
            username: 'mac-gyver',
            avatarUrl: 'https://avatars.githubusercontent.com/u/123254210?v=4',
          },
          title: 'Mobile App with Flutter',
          description:
            'Cross-platform mobile application built with Flutter and Dart. Features include offline support, real-time synchronization, and native performance.',
          image: 'https://example.com/mobile-app-image.jpg',
          techStacks: [
            {
              id: '10',
              name: 'Flutter',
              iconUrl:
                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg',
              type: 'TECH',
            },
            {
              id: '11',
              name: 'Dart',
              iconUrl:
                'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg',
              type: 'LANGUAGE',
            },
          ],
          teamMembers: [
            {
              id: 'member3',
              projectId: '123e4567-e89b-12d3-a456-426614174001',
              userId: 'github_user456',
              joinedAt: '2025-01-10T09:15:00.000Z',
            },
          ],
          stats: {
            stats: {
              forks: 8,
              stars: 23,
              watchers: 12,
              openIssues: 2,
            },
            contributors: [
              {
                login: 'mac-gyver',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/123254210?v=4',
                html_url: 'https://github.com/mac-gyver',
                contributions: 18,
              },
            ],
            commits: {
              lastCommit: {
                sha: '8a9b2c3d4e5f6789012345678901234567890abcd',
                message: 'fix: Resolve memory leak in image caching',
                date: '2025-01-20T16:30:00Z',
                url: 'https://github.com/mac-gyver/mobile-app/commit/8a9b2c3d4e5f6789012345678901234567890abcd',
                author: {
                  login: 'mac-gyver',
                  avatar_url:
                    'https://avatars.githubusercontent.com/u/123254210?v=4',
                  html_url: 'https://github.com/mac-gyver',
                },
              },
              commitsNumber: 31,
            },
          },
          createdAt: '2025-01-10T09:15:00.000Z',
          updatedAt: '2025-01-20T16:30:00.000Z',
        },
      ],
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
