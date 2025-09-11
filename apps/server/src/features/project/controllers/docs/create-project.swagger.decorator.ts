import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateProjectDto } from '../dto/create-project.dto';

export function CreateProjectDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new project',
      description:
        'Creates a new open-source project with the specified details. Supports two creation methods: scratch (creates new GitHub repository) or github (imports existing repository).',
    }),
    ApiCookieAuth('sAccessToken'),
    ApiQuery({
      name: 'method',
      required: true,
      enum: ['scratch', 'github'],
      description:
        'Project creation method: "scratch" to create a new project from scratch, "github" to import an existing repository',
      example: 'scratch',
    }),
    ApiBody({
      type: CreateProjectDto,
      description:
        'Project data including title, description, technologies, roles, and external links',
      examples: {
        scratch: {
          summary: 'Create project from scratch',
          description: 'Creates a new project and GitHub repository',
          value: {
            title: 'My Awesome OSS Project',
            description:
              'A modern open-source project built with cutting-edge technologies to solve real-world problems',
            categories: ['1', '4'],
            techStacks: ['3', '7', '9'],
            projectRoles: [
              {
                title: 'Frontend Developer',
                description:
                  'Build responsive UI components with React and TypeScript',
                techStacks: ['3', '9'],
              },
              {
                title: 'Backend Developer',
                description:
                  'Develop RESTful APIs and microservices with Node.js',
                techStacks: ['7', '8'],
              },
            ],
            keyFeatures: [
              'Real-time collaboration',
              'Responsive design',
              'RESTful API',
              'Database integration',
            ],
            image: 'https://example.com/project-logo.png',
            coverImages: [
              'https://example.com/cover-1.png',
              'https://example.com/cover-2.png',
            ],
            readme:
              '# My Awesome OSS Project\n\nA modern open-source project...',
            externalLinks: [
              { type: 'GITHUB', url: 'https://github.com/org/repo' },
              { type: 'WEBSITE', url: 'https://myproject.com' },
              { type: 'DISCORD', url: 'https://discord.gg/myproject' },
            ],
          },
        },
        github: {
          summary: 'Import existing GitHub repository',
          description: 'Imports an existing GitHub repository as a project',
          value: {
            title: 'Existing GitHub Project',
            description:
              'An existing project imported from GitHub with all its features and history',
            categories: ['2', '5'],
            techStacks: ['1', '6'],
            projectRoles: [
              {
                title: 'Full Stack Developer',
                description: 'Work on both frontend and backend components',
                techStacks: ['1', '6'],
              },
            ],
            keyFeatures: [
              'Existing codebase',
              'GitHub integration',
              'Community contributions',
            ],
            externalLinks: [
              { type: 'GITHUB', url: 'https://github.com/existing/repo' },
              { type: 'TWITTER', url: 'https://twitter.com/myproject' },
            ],
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Project created successfully',
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        owner: {
          id: 'NLxTW4lMvMJSbEvpIShgtckD15cnbFVH',
          username: 'y2_znt',
          avatarUrl: 'https://avatars.githubusercontent.com/u/152095147?v=4',
        },
        title: 'My Awesome OSS Project',
        description:
          'A modern open-source project built with cutting-edge technologies',
        image: 'https://example.com/project-logo.png',
        coverImages: ['https://example.com/cover-1.png'],
        readme: '# My Awesome OSS Project\n\nA modern open-source project...',
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
        ],
        keyFeatures: [
          {
            id: '107877b3-262b-44d0-8d84-5828d444872b',
            projectId: '123e4567-e89b-12d3-a456-426614174000',
            feature: 'Real-time collaboration',
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
            ],
          },
        ],
        externalLinks: [
          {
            id: '6c361ece-8e85-46b0-8888-d620c9b1f878',
            type: 'GITHUB',
            url: 'https://github.com/org/repo',
          },
          {
            id: 'd89809b3-fa85-4c0b-984f-1b1cf672a3a9',
            type: 'WEBSITE',
            url: 'https://myproject.com',
          },
        ],
        createdAt: '2025-09-10T23:20:06.607Z',
        updatedAt: '2025-09-10T23:20:06.607Z',
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Validation failed',
      examples: {
        validation: {
          summary: 'Validation errors',
          value: {
            message: [
              'property title should not be empty',
              'property description should not be empty',
              'categories must contain at least 1 element',
              'techStacks must contain at least 1 element',
            ],
            error: 'Bad Request',
            statusCode: 400,
          },
        },
        duplicate: {
          summary: 'Duplicate project title',
          value: {
            message: 'A project with this title already exists',
            error: 'Bad Request',
            statusCode: 400,
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Authentication required',
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
