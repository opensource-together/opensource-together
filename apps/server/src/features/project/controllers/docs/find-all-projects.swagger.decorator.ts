import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function FindAllProjectsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all projects' }),
    ApiResponse({
      status: 200,
      description: 'List of all projects',
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          owner: {
            id: 'github_user123',
            name: 'Lhourquin',
            githubLogin: 'lhourquin',
            image: 'https://avatars.githubusercontent.com/u/123456789?v=4',
          },
          title: 'E-commerce Platform',
          description: 'Modern e-commerce app with React',
          image: 'https://example.com/project-image.jpg',
          techStacks: [
            {
              id: '1',
              name: 'React',
              iconUrl: 'https://reactjs.org/logo.svg',
              type: 'TECH',
            },
            {
              id: '2',
              name: 'Node.js',
              iconUrl: 'https://nodejs.org/logo.svg',
              type: 'TECH',
            },
          ],
          teamMembers: [
            {
              id: 'member1',
              projectId: '123e4567-e89b-12d3-a456-426614174000',
              userId: 'github_user123',
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
              forks: 2,
              stars: 1,
              watchers: 1,
              openIssues: 1,
            },
            contributors: [
              {
                login: 'Lhourquin',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/45101981?v=4',
                html_url: 'https://github.com/Lhourquin',
                contributions: 3,
              },
              {
                login: 'Jyzdcs',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/123254210?v=4',
                html_url: 'https://github.com/Jyzdcs',
                contributions: 1,
              },
            ],
            commits: {
              lastCommit: {
                sha: '4f017368bdc6fe9ca8f4bac1b497e01d25562b6e',
                message: 'Merge pull request #2 from Jyzdcs/main\n\ntest',
                date: '2025-07-15T23:17:16Z',
                url: 'https://github.com/Lhourquin/projet-os/commit/4f017368bdc6fe9ca8f4bac1b497e01d25562b6e',
                author: {
                  login: 'Lhourquin',
                  avatar_url:
                    'https://avatars.githubusercontent.com/u/45101981?v=4',
                  html_url: 'https://github.com/Lhourquin',
                },
              },
              commitsNumber: 4,
            },
          },
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-20T14:45:00.000Z',
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          owner: {
            id: 'github_user456',
            name: 'Mac-Gyver',
            githubLogin: 'mac-gyver',
            image: 'https://avatars.githubusercontent.com/u/123254210?v=4',
          },
          title: 'Mobile App with Flutter',
          description: 'Cross-platform mobile app built with Flutter',
          image: 'https://example.com/mobile-app-image.jpg',
          techStacks: [
            {
              id: '3',
              name: 'Flutter',
              iconUrl: 'https://flutter.dev/logo.svg',
              type: 'TECH',
            },
            {
              id: '4',
              name: 'Dart',
              iconUrl: 'https://dart.dev/logo.svg',
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
              forks: 5,
              stars: 12,
              watchers: 8,
              openIssues: 3,
            },
            contributors: [
              {
                login: 'Mac-Gyver',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/123254210?v=4',
                html_url: 'https://github.com/Mac-Gyver',
                contributions: 8,
              },
            ],
            commits: {
              lastCommit: {
                sha: '8a9b2c3d4e5f6789012345678901234567890abcd',
                message: 'Add new feature: user authentication',
                date: '2025-01-20T16:30:00Z',
                url: 'https://github.com/Mac-Gyver/mobile-app/commit/8a9b2c3d4e5f6789012345678901234567890abcd',
                author: {
                  login: 'Mac-Gyver',
                  avatar_url:
                    'https://avatars.githubusercontent.com/u/123254210?v=4',
                  html_url: 'https://github.com/Mac-Gyver',
                },
              },
              commitsNumber: 25,
            },
          },
          createdAt: '2025-01-10T09:15:00.000Z',
          updatedAt: '2025-01-20T16:30:00.000Z',
        },
      ],
    }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
}
