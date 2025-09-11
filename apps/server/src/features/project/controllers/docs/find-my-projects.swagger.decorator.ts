import { applyDecorators } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function FindMyProjectsDocs() {
  return applyDecorators(
    ApiCookieAuth('sAccessToken'),
    ApiOperation({
      summary: 'Get current user projects',
      description:
        'Retrieves all projects owned by the currently authenticated user with complete project details including roles, external links, and statistics.',
    }),
    ApiResponse({
      status: 200,
      description: 'Successfully retrieved user projects',
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
          image: 'https://example.com/project-logo.png',
          coverImages: [
            'https://example.com/cover-1.png',
            'https://example.com/cover-2.png',
          ],
          readme: '# E-commerce Platform\n\nA modern e-commerce solution...',
          categories: [
            { id: '1', name: 'IA & Machine Learning' },
            { id: '4', name: 'Web Development' },
          ],
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
          keyFeatures: [
            {
              id: '107877b3-262b-44d0-8d84-5828d444872b',
              projectId: '123e4567-e89b-12d3-a456-426614174000',
              feature: 'Real-time inventory management',
            },
            {
              id: '207877b3-262b-44d0-8d84-5828d444872b',
              projectId: '123e4567-e89b-12d3-a456-426614174000',
              feature: 'Payment processing integration',
            },
          ],
          projectRoles: [
            {
              id: 'b7130a7c-09b4-46dd-8f5d-043938cf40b9',
              title: 'Frontend Developer',
              description:
                'Build responsive UI components with React and TypeScript',
              techStacks: [
                {
                  id: '3',
                  name: 'React',
                  iconUrl:
                    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
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
            },
            {
              id: 'c7130a7c-09b4-46dd-8f5d-043938cf40b9',
              title: 'Backend Developer',
              description:
                'Develop RESTful APIs and microservices with Node.js',
              techStacks: [
                {
                  id: '7',
                  name: 'Node.js',
                  iconUrl:
                    'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
                  type: 'TECH',
                },
              ],
            },
          ],
          externalLinks: [
            {
              id: '6c361ece-8e85-46b0-8888-d620c9b1f878',
              type: 'GITHUB',
              url: 'https://github.com/y2_znt/ecommerce-platform',
            },
            {
              id: 'd89809b3-fa85-4c0b-984f-1b1cf672a3a9',
              type: 'WEBSITE',
              url: 'https://ecommerce-platform.com',
            },
            {
              id: 'e89809b3-fa85-4c0b-984f-1b1cf672a3a9',
              type: 'DISCORD',
              url: 'https://discord.gg/ecommerce-platform',
            },
          ],
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-20T14:45:00.000Z',
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          owner: {
            id: 'NLxTW4lMvMJSbEvpIShgtckD15cnbFVH',
            username: 'y2_znt',
            avatarUrl: 'https://avatars.githubusercontent.com/u/152095147?v=4',
          },
          title: 'Mobile App with Flutter',
          description:
            'Cross-platform mobile application built with Flutter and Dart. Features include offline support, real-time synchronization, and native performance.',
          image: 'https://example.com/mobile-app-image.jpg',
          coverImages: ['https://example.com/mobile-cover.png'],
          readme: '# Mobile App\n\nA Flutter mobile application...',
          categories: [{ id: '2', name: 'Mobile Development' }],
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
          keyFeatures: [
            {
              id: '307877b3-262b-44d0-8d84-5828d444872b',
              projectId: '123e4567-e89b-12d3-a456-426614174001',
              feature: 'Offline support',
            },
            {
              id: '407877b3-262b-44d0-8d84-5828d444872b',
              projectId: '123e4567-e89b-12d3-a456-426614174001',
              feature: 'Real-time synchronization',
            },
          ],
          projectRoles: [
            {
              id: 'd7130a7c-09b4-46dd-8f5d-043938cf40b9',
              title: 'Mobile Developer',
              description:
                'Develop cross-platform mobile applications with Flutter',
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
            },
          ],
          externalLinks: [
            {
              id: 'f6c361ece-8e85-46b0-8888-d620c9b1f878',
              type: 'GITHUB',
              url: 'https://github.com/y2_znt/mobile-app',
            },
            {
              id: 'g89809b3-fa85-4c0b-984f-1b1cf672a3a9',
              type: 'TWITTER',
              url: 'https://twitter.com/mobileapp',
            },
          ],
          createdAt: '2025-01-10T09:15:00.000Z',
          updatedAt: '2025-01-20T16:30:00.000Z',
        },
      ],
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - User not authenticated',
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
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
